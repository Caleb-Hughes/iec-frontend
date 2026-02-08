import {useEffect, useMemo, useState} from 'react';
import {format} from 'date-fns';
import {useAuth} from '../auth/AuthContext'
import LoginPop from '../auth/LoginPop'
import BookingForm from "@/Components/booking/BookingForm";
import TimeSlotSelector from "@/Components/booking/TimeSlotSelector";
import ConfirmationPanel from "@/Components/booking/ConfirmationPanel";
import apiClient from '../api/index';
import {useNavigate } from 'react-router-dom';

//Concvert Date object to "YYYY-MM-DD" format
const isDate = (date) => format(date, 'yyyy-MM-dd');

//Group time strings into morning, afternoon, evening
const groupTimeSlots = (timeSlots) => {
    const [h] = String(timeSlots).split(':').map(Number);
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
    const [selectedServiceId, setSelectedServiceId] = useState('');
    //Selected stylist ID
    const [selectedStylistId, setSelectedStylistId] = useState('');
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
    //track when user clicked
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [successDetails, setSuccessDetails] = useState(null);
    const [confirming, setConfirming] = useState(false);
    const [confirmError, setConfirmError] = useState('');
    const [confirmSuccess, setConfirmSuccess] = useState(false);
    const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
    const navigate = useNavigate();

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
    const normalizeSlots = (payload) => {
        if (!payload) return [];

        // axios response shapes
        if (Array.isArray(payload?.data)) return payload.data;

        if (Array.isArray(payload.availableSlots)) return payload.availableSlots;
        if (Array.isArray(payload.slots)) return payload.slots;

        if (Array.isArray(payload)) return payload;

        if (payload && typeof payload === "object") {
            // if object of times -> booleans
         return Object.keys(payload);
        }

        if (typeof payload === "string") {
            try {
            const parsed = JSON.parse(payload);
            if (Array.isArray(parsed)) return parsed;
            } catch {}
            return payload.split(",").map((s) => s.trim()).filter(Boolean);
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
        setEligibleStylists(new Set(stylistsArr.map((st) => st.id)));
    } catch (err) {
      setError('Failed to load data. Please try again later.');
    } finally {
      if (mounted) setLoading(false);
    }
  })();

  return () => { mounted = false; };
}, []);

useEffect(() => {
    //reset downstream slctns
    setSelectedStylistId("");
    setSelectedDate(null)
    setSlots([]);
    setSelectedSlot(null);
    setShowConfirmDialogue(false);
    setSlotsError(null)
    setHasSearched(false)

    //if no service selectetd allow alal stylists

    if (!selectedServiceId) {
        setEligibleStylists(new Set(stylists.map((st) =>st.id)));
        return
    }

    let isMounted = true;
    setLoadingEligible(true);

    (async () => {
        try {
            const response = await apiClient.get("/stylists", {
                params: {serviceId: selectedServiceId},
            });

            const arr = Array.isArray(response?.data)
                ? response.data
                : Array.isArray(response?.data?.data)
                ? response.data.data
                : Array.isArray(response?.data?.stylists)
                ? response.data.stylists
                : [];

            if (!isMounted) return;

            setEligibleStylists(new Set(arr.map((st) => st.id)));
        } catch (err) {
            //fallback 
            const ids = stylists
            .filter((st) => Array.isArray(st.services) && st.services.includes(selectedServiceId))
            .map((st) => st.id)

            if (isMounted) setEligibleStylists(new Set(ids));
        } finally {
            if (isMounted) setLoadingEligible(false);
        }
    })();
    return () => {
        isMounted = false;
    };
}, [selectedServiceId, stylists]);
    const isStylistEligible = (stylistId) => 
        !selectedServiceId || eligibleStylists.has(stylistId);

    const filteredStylists = useMemo(() => {
        return (stylists || []).filter((st) => isStylistEligible(st.id));
    }, [stylists, eligibleStylists, selectedServiceId]);


    const fetchAvailableTimeSlots = async () => {
        console.log("fetchAvailableTimeSlots fired");
        if (loadingSlots) return;
        if (!selectedStylistId || !selectedDate) return;

        setHasSearched(true);
        setSlotsError(null);

        try {
            setLoadingSlots(true);

            const response = await apiClient.get(
                `/stylists/${selectedStylistId}/available-slots`,
                {params: {date: isDate(selectedDate), serviceId: selectedServiceId}}
            );

            const slotsArray = normalizeSlots(response?.data);
            setSlots(Array.isArray(slotsArray) ? slotsArray: []);
        } catch (err) {
            console.error(err);
            setSlots([]);
            setSlotsError("Failed to load available time slots. Please try again later.");
        } finally {
            setLoadingSlots(false);
        }
    };
    // Gropu slots for UI

    const groupedSlots = useMemo(() => {
        const groups = {Morning: [], Afternoon: [], Evening: []};
        (Array.isArray(slots) ? slots : []).forEach((slot) => {
            const key = groupTimeSlots(slot);
            groups[key].push(slot);
        });
        return groups;
    }, [slots]);

    //Slot click to open confirm panel
    const onSelectedSlot = (slot) => {
        setSelectedSlot(slot);
        setConfirmError("");
        setShowConfirmDialogue(true)
    };

    //Backend post to confirm appointment

    const confirm = async () => {
        try {
            setConfirming(true);
            setConfirmError("");

            //Guaard

            if(!selectedServiceId || !selectedStylistId || !selectedDate || !selectedSlot ) {
                setConfirmError('Missing booking information (service, stylist, date, or time).');
                return;
            }

            //Iso datetime
            const [hh, mm] = String(selectedSlot).split(":").map(Number);
            const localDateTime = new Date(selectedDate);
            localDateTime.setHours(hh, mm, 0, 0);

            const payload = {
                service: selectedServiceId,
                stylist: selectedStylistId,
                date: localDateTime.toISOString(),
            };

            const res = await apiClient.post("/appointments", payload);
            console.log("book success:", res.data);

            setSuccessDetails({
                date: selectedDate,
                time: selectedSlot,
                stylist: stylists.find((st) => st.id === selectedStylistId),
                service: services.find((svc => svc.id === selectedServiceId)),
            });


            setConfirmSuccess(true);
            setShowConfirmDialogue(false);
            setSelectedSlot(null);
        } catch (e) {
            console.error("Book failed:", e);
            setConfirmError(e?.response?.data?.message || "Could not book appointment");
        } finally {
            setConfirming(false);
        }

    };

    const onConfirmClick = () => {
        if (!selectedSlot) return;
        
        if (!user) {
            setLoginOpen(true);
            return;
        }

        confirm();
    };

    const selectedStylistName = stylists.find((st) => st.id === selectedStylistId)?.name || "Selected Stylist";
    const selectedServiceName = services.find((svc) => svc.id === selectedServiceId)?.name || "Selected Service";

    return (
        <div className ="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <main className="py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* step 1-3: Form*/}
                    <BookingForm
                        services={services}
                        stylists={filteredStylists}
                        selectedServiceId={selectedServiceId}
                        setSelectedServiceId={setSelectedServiceId}
                        selectedStylistId={selectedStylistId}
                        setSelectedStylistId={setSelectedStylistId}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        onSearch={fetchAvailableTimeSlots}
                        searching={loadingSlots}
                        loadingServices={loading}
                        loadingStylist={loadingEligible}
                        disableStylistSelect={!selectedServiceId || loadingEligible}
                    />
                    {error ? (
                        <div className="max-w-4xl mx-auto text-sm text-red-600">
                            {error}
                        </div>
                    ) : null }

                    {slotsError ? (
                        <div className="max-w-4xl mx-auto text-sm text-red-600">{slotsError}</div>
                    ) : null}
                    {hasSearched && !loadingSlots && slots.length === 0 && selectedDate && selectedStylistId ? (
                        <div className="max-w-4xl mx-auto text-sm text-gray-600">
                            No Available time slots found on {format(selectedDate, "PP")}. Try another day or stylist.
                        </div>
                    ) : null}
                    
                    {/*Time slots*/}   
                    {!loadingSlots && slots.length > 0 && (
                        <TimeSlotSelector
                            staffName={selectedStylistName}
                            serviceName={selectedServiceName}
                            groupedSlots={groupedSlots}
                            selectedSlot={selectedSlot}
                            onSelectedSlot={onSelectedSlot}
                            to12h={to12h}
                        />
                    )}
                    {/*Confirm Panel*/}
                    {showConfirmDialogue && selectedSlot && (
                        <ConfirmationPanel
                            selectedDate={selectedDate}
                            selectedTimeLabel={to12h(selectedSlot)}
                            stylistName={selectedStylistName}
                            serviceName={selectedServiceName}
                            onConfirm={onConfirmClick}
                            onCancel={() => {
                                setShowConfirmDialogue(false);
                                setSelectedSlot(null);
                                setConfirmError("");
                            }}
                            confirming={confirming}
                                    errorMessage={confirmError}
                                />
                            )}
        
                            {/*Login popup*/}
                            <LoginPop
                                open={loginOpen}
                                onClose={() => setLoginOpen(false)}
                                onSuccess={() => {
                                    setLoginOpen(false);
                                    confirm();
                                }}
                            />
                            {/* Success Modal */}
                            {confirmSuccess && successDetails && (
                                <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
                                    <div className="bg-white rounded-2xl w-[360px] p-5">
                                        <h3 className="font-semibold text-lg mb-2">Appointment booked!</h3>
                                            <p className="font-semibold text-lg mb-2">
                                            You&apos;re all set for {" "}
                                            {successDetails?.date ? format(new Date(successDetails.date), "PP") : ""}{" "}
                                            at {to12h(successDetails.time)} with {successDetails.stylist?.name}.
                                            </p>
                                            <div className="mt-4 justify-center flex gap-3">
                                                <button
                                                    className="bg-gray-900 text-white rounded-lg px-4 py-2 cursor-pointer"
                                                    onClick={() => navigate("/")}
                                                >
                                                Return To Home
                                                </button>
                                            </div>
                                    </div>
                                </div>
                            )}
                            {/*Error Modal*/}
                            {!showConfirmDialogue && confirmError ? (
                                <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
                                    <div className="bg-white rounded-2xl w-[360px] p-5">
                                        <h3 className="font-semibold text-lg mb-2">Booking Failed</h3>
                                        <p className="text-sm text-red-600">{confirmError}</p>
                                        <div className="mt-4 text-right">
                                            <button 
                                                className="bg-gray-900 text-white rounded-lg px-3 py-2"
                                                onClick={() => setConfirmError("")}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </main>
                </div>
            );
        }
   
