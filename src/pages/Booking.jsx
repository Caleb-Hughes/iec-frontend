import {useEffect, useMemo, useState} from 'react';
import {format} from 'date-fns';
import {DayPicker} from 'react-day-picker';
import {useAuth} from '../auth/AuthContext'
import LoginPop from '../auth/LoginPop'
import 'react-day-picker/dist/style.css';
import apiClient from '../api/index';

//Concvert Date object to "YYYY-MM-DD" format
const isDate = (date) => format(date, 'yyyy-MM-dd');

//Group time strings into morning, afternoon, evening
const groupTimeSlots = (timeSlots) => {
    const [h] = timeSlots.split(':').map(Number);
    if (h < 12 ) return 'Morning';
    if (h < 17 ) return 'Afternoon';
    return 'Evening';
}
// Main Booking component
export default function BookingPage() {
    
    //Pulling data from server

    //all serviices 
    const [services, setServices] = useState([]);
    //all stylists 
    const [stylists, setStylists] = useState([]);
    //Stylists with eligible ID for selected service
    const [eligibleStylists, setEligibleStylists] = useState(new Set());
    //Selected service ID
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    //Selected stylist ID
    const [selectedStylistId, setSelectedStylistId] = useState(null);
    //Selected date
    const [selectedDate, setSelectedDate] = useState(null);
    //Available time slots for selected stylist and date
    const [slots, setSlots] = useState([]);
    //flag to track if client has made a search
    const [hasSearched, setHasSearched] = useState(false);
    //loading available time slots
    const [loadingSlots, setLoadingSlots] = useState(false);
    //Error message for slots loading
    const [slotsError, setSlotsError] = useState(null); 
    //UI state
    const [loading, setLoading] = useState(true);
    const [loadingEligible, setLoadingEligible] = useState(false);
    const [error, setError] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    //rack when user clicked
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [confirming, setConfirming] = useState(false);
    const [confirmError, setConfirmError] = useState('');
    const [confirmSuccess, setConfirmSuccess] = useState(false);
    const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);

    //Login popup visibility
    const [loginOpen, setLoginOpen] = useState(false);
    //Pull current user from AuthContext
    const {user} = useAuth();
    
    //ISO to 12HR
    const to12h = (time) => {
        const s = String(time);
        const m = s.match(/^(\d{1,2}):(\d{2})$/);
        let h, min ;
        if (m) {
            h = parseInt(m[1],10);
            min = m[2];
        } else {
            const date = new Date(s);
            if (isNaN(date.getTime())) return s;
            h = date.getHours();
            min = String(date.getMinutes()).padStart(2, '0');
        }
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${min} ${ampm}`;
    };
    const onSlotClick = (slot) => {
        setSelectedSlot(slot);
        setConfirmError('');
        setShowConfirmDialogue(true);
    };
    const normalizeSlots = (payload) => {
        if (payload && Array.isArray(payload.availableSlots)) return payload.availableSlots;

        if (Array.isArray (payload)) return payload;

        if (payload && Array.isArray(payload.slots)) return payload.slots;

        if (payload && typeof payload === 'object') return Object.keys(payload);

        if (typeof payload === 'string') {
            try {
                const parsed = JSON.parse(payload);
                if (Array.isArray(parsed)) return parsed;
            } catch {}
            return payload.split(',').map((s) => s.trim()).filter(Boolean);
        }
        return [];
    };
    //Loading services and stylists on component mount
    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const [servicesRes, stylistsRes] = await Promise.all([
                    apiClient.get('/services'),
                    apiClient.get('/stylists'),
                ]);

                if (!mounted) return;

        // normalize any backend shape to an array
        const toArray = (x) =>
            Array.isArray(x) ? x
            : Array.isArray(x?.data) ? x.data
            : Array.isArray(x?.services) ? x.services
            : Array.isArray(x?.items) ? x.items
            : [];

        const servicesArr = toArray(servicesRes?.data);
        const stylistsArr = toArray(stylistsRes?.data);

        setServices(servicesArr);
        setStylists(stylistsArr);
        setEligibleStylists(new Set(stylistsArr.map((st) => st._id)));
    } catch (err) {
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  })();

  return () => { mounted = false; };
}, []);
    //Create appointment on server
    const confirm = async () => {
        try{
            setConfirming(true);
            setConfirmError('');
            await apiClient.post('/appointments', {
                stylistId: selectedStylistId,
                serviceId: selectedServiceId,
                date: isDate(selectedDate),
                time: selectedSlot
            });
            setShowConfirmDialogue(true)
            setConfirmSuccess(true); //show success popup
            setSelectedSlot(null)
        } catch (e) {
            console.error('Book failed:', e?.response?.data || e.message);
            setConfirmError(e?.response?.data?.message || 'Could not book appointment');
        } finally {
            setConfirming(false);
        }
    };
    const onConfirmClick = () => {
        if (!selectedSlot) return; //guard
        if (!user) {
            setLoginOpen(true); //user not logged in and must open loginpop
            return;
        }
        confirm() //logged in continue to book 
    };
    const toArray = (x) =>
        Array.isArray(x) ? x
        : Array.isArray(x?.data) ? x.data
        : Array.isArray(x?.stylists) ? x.stylists
        : Array.isArray(x?.items) ? x.items
        : [];
    //When a service is selected, update eligible stylists
    useEffect(() => {
        //resetting selections
        setSelectedStylistId(null);
        setSlots([]);
        setSelectedDate(null);
        setShowCalendar(false);
        setSlotsError(null);
        setHasSearched(false);
        //if no service picked, keep every stylist visible and selectable
        if (!selectedServiceId) {
            setEligibleStylists(new Set(stylists.map(st => st._id)));
            return;
        }

        let isMounted = true; // To avoid setting state on unmounted component
        setLoadingEligible(true);
        (async () => {
            try {
                const response = await apiClient.get('/stylists', {params: {serviceId: selectedServiceId}});
                if (!isMounted) return;
                const arr = toArray(response?.data);
                //Building a set of eligible stylist IDs for quick lookup
                setEligibleStylists(new Set((arr.map(st => st._id))));
            } catch (err) {
                //fallback: client side filtering
                const fallbackIds = stylists
                    .filter(st => Array.isArray(st.services) && st.services.includes(selectedServiceId))
                    .map(st => st._id);
                setEligibleStylists(new Set(fallbackIds));
            } finally {
                if (isMounted) setLoadingEligible(false);       
            }
        })();
        return () => {
            isMounted = false; // Cleanup flag on unmount
        };
    }, [selectedServiceId, stylists]);
    
    const canSearch = !!(selectedStylistId && selectedDate);
    //When service changes: reset stylist, date, slots, errors
    useEffect(() => {
        //Reset downstream choices
        setSelectedStylistId(null);
        setSlots([]);
    if (!selectedServiceId) {
        setEligibleStylists(new Set(stylists.map(st => st._id)));
        return;
    }
    (async () => {
        try {
            setLoadingEligible(true); // Show loading indicator
            //Fetch eligible stylists from server
            const response = await apiClient.get('/stylists', {params: {serviceId: selectedServiceId}});
            setEligibleStylists(new Set((response?.data ?? []).map(st => st._id)));
        } catch {
            //fallback: client side filtering
            const ids = stylists
                .filter(st => Array.isArray(st.services) && st.services.includes(selectedServiceId))
                .map(st => st._id);
            setEligibleStylists(new Set(ids));
        } finally {
            setLoadingEligible(false);
        }
    })();
    }, [selectedServiceId, stylists]);
    //Helper to check if a stylist is eligible for the selected service
    const isStylistEligible = (stylistId) => !selectedServiceId || eligibleStylists.has(stylistId);

    //fetch available time slots for selected stylist and date
    const fetchAvailableTimeSlots = async () => {
    //Guard clause
    if (loadingSlots) return;
    if (!selectedStylistId || !selectedDate) return;
    setSlotsError(null);
    setHasSearched(true)

    try {
        setError("");
        setLoadingSlots(true);

        //Ask API for that stylist's slots on yyyy-mm-dd 
        const response = await apiClient.get(
            `/stylists/${selectedStylistId}/available-slots`,
            {params: {date: isDate(selectedDate), serviceId: selectedServiceId}}
        );
    //Normalize to array
    const payload = response?.data;
    const slotsArray = Array.isArray(payload?.availableSlots) ? payload.availableSlots : normalizeSlots(payload)
    setSlots(Array.isArray(slotsArray) ? slotsArray : []);

    } catch (err) {
        setSlots([]);
        setSlotsError("Failed to load available time slots. Please try again later.");
    }
    finally {
        setLoadingSlots(false);
    }
    };
    //Week strip (Sun-Sat) for calendar navigation
    //Grouping available slots by time of day
    const groupedSlots = useMemo(() => {
        const groups = {Morning: [], Afternoon: [], Evening: []};  
        //Nake defensive
        const list = Array.isArray(slots) ? slots : [];
        list.forEach(slot => {
            const group = groupTimeSlots(slot);
            if (groups[group]) {
                groups[group].push(slot);
            }
        });
        return groups;
    }, [slots]);
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Book an Appointment</h2>

            {/*Service Selection*/}
            <label className="block text-sm font-medium mb-1">Service</label>
            <select
                className="w-full h-14 bg-white text-gray-900 border-gray-200 rounded-2xl shadow-sm px-4 pr-10 appearance-none
                           focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 disabled:bg-gray-100 disabled:text-gray-400
                           disabled:border-gray-300 disabled:cursor-not-allowed"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value || null)}
                disabled={loading || services.length === 0}
            >
                <option value="">Select a service</option>
                {(Array.isArray(services) ? services : []).map((s) => (
                    <option key={s._id} value={s._id}>
                        {s.name} - ${s.price}
                    </option>
                ))}
            </select>
            
            {/*Stylist Selection*/}
            <label className="block text-sm font-medium mb-1">Stylist</label>
            <select
                className="w-full h-14 bg-white text-gray-900 border-gray-200 rounded-2xl shadow-sm px-4 pr-10 appearance-none
                           focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 disabled:bg-gray-100 disabled:text-gray-400
                           disabled:border-gray-300 disabled:cursor-not-allowed"
                value={selectedStylistId || ''}
                onChange={(e) => setSelectedStylistId(e.target.value || null)}
                disabled={loading || loadingEligible || !selectedServiceId || eligibleStylists.size === 0}
            >
                <option value="">Select a stylist</option>
                {(Array.isArray(stylists) ? stylists : []).map((st) => (
                    <option 
                        key={st._id} 
                        value={st._id} 
                        disabled={!isStylistEligible(st._id)}
                        className={!isStylistEligible(st._id) ? 'text-gray-400' : ''}
                    >
                        {st.name} { !isStylistEligible(st._id) ? '(Not available for selected service)' : ''}
                    </option>
                ))}
            </select>
            {/*Date dropdown */}
            <div className="relative w-64 mb-4">
                <label className="block text-sm font-medium mb-1">Date </label>
                <button
                    type="button"
                    className="border rounded-lg px-3 py-2 w-full text-left bg-white"
                    onClick={() => setShowCalendar((v) => !v)}
                    disabled={!selectedServiceId || !selectedStylistId}
                >
                    {selectedDate ? format(selectedDate, 'PP') : 'Select a date'}
                </button>

                {showCalendar && (
                    <div className="absolute left-0 mt-2 z-50 rounded-lg border bg-white shadow-lg">
                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={(day) => {
                                if (day) setSelectedDate(day);
                                setShowCalendar(false);
                                setSlots([]);
                                setHasSearched(false);
                            }}
                        />
                    </div>
                )}
            </div>
            {/*Fetch Slots Button*/}
            <button 
                onClick={fetchAvailableTimeSlots}
                disabled={!canSearch}
                className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg px-4 py-2 disabled:opacity-40"
            >
                Search
            </button>
            {/*Any Error Message*/}
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {/*Loading Indicator*/}
            {(loading || loadingEligible) && <div className="mb-4">Loading...</div>}

            {/*Results Section (only rended if times found)*/}
            {!loadingSlots && slots.length > 0 && (
                <>
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                        {/*Header area showing selectetd stylist and service*/}
                        <div className="flex items-center justify-between">
                            <div className="font-semibold">
                                {stylists.find(st => st._id === selectedStylistId)?.name || 'Selected Stylist'}
                        </div>
                        {selectedServiceId && (
                            <div className="text-sm text-gray-500">
                                {services.find(s => s._id === selectedServiceId)?.name || 'Selected Service'}
                            </div>
                        )}
                    </div>
                </div>

            {/*Time slots grouped by time of day*/}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Morning', 'Afternoon', 'Evening'].map(period => (
                    <div key={period}>
                        <div className="mb-2 text-sm font-medium text-gray-500">{period}</div>
                            <div className="flex flex-wrap gap-2">
                                {(groupedSlots[period] ?? []).map((slot) => (
                                <button
                                    key={slot}
                                    className={`rounded-lg border bg-white px-3 py-2 ${selectedSlot===slot ? 'bg-rose-500 text-white' : 'bg-white'}`}
                                    onClick={() => 
                                        onSlotClick(slot)
                                    }
                                >
                                    {to12h(slot)}
                                </button>       
                            ))}
                            </div>
                    </div>
                    ))}
                </div>
                <LoginPop
                    open={loginOpen}
                    onClose={()=> setLoginOpen(false)}
                    onSuccess={confirm}
                />
                {showConfirmDialogue && selectedSlot && (
                <div className="mt-4 flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
                    <div className="text-sm text-gray-700">
                        Confirm {format(selectedDate, 'PP')} at {to12h(selectedSlot)} with{' '}
                        {stylists.find(st => st._id === selectedStylistId)?.name}
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="rounded-lg border px-3 py-2"
                            onClick={() => {
                            setShowConfirmDialogue(false);
                            setSelectedSlot(null);
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-rose-500 text-white rounded-lg px-4 py-2 disabled:opacity-40"
                        onClick={onConfirmClick}
                        disabled={confirming}
                    >
                        {confirming ? 'Booking…' : 'Confirm appointment'}
                    </button>
                </div>
            </div>
        )}
                {/* Error modal */}
                {confirmError && (
                    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
                        <div className="bg-white rounded-2xl w-[360px] p-5">
                            <h3 className="font-semibold text-lg mb-2">Booking failed</h3>
                            <p className="text-sm text-red-600">{confirmError}</p>
                            <div className="mt-4 text-right">
                                <button
                                    className="bg-gray-900 text-white rounded-lg px-3 py-2"
                                    onClick={() => setConfirmError('')}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                     </div>
                )}
            </>
        )}
        {/*show empty state if no slots found*/}
        {hasSearched && !loadingSlots && slots.length === 0 && selectedStylistId && selectedDate && (
            <div className="text-gray-500 mt-4">No available time slots found on {format(selectedDate, 'PP')}. Try another day or stylist</div> 
        )}
    </div>
    );
}