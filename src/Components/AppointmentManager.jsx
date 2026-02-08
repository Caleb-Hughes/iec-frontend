import {useEffect, useMemo, useState } from "react";
import { Calendar as CalendarIcon, Clock, User, Scissors, X, CalendarClock } from "lucide-react";
import {format} from "date-fns"
import apiClient from "../api";
import {Button} from "./ui/button";
import {Calendar} from "./ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "./ui/popover";

export default function AppointmentManager() {
    const [activeTab, setActiveTab] = useState("upcoming");
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    /*Cancel modal state*/ 
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [busyCancel, setBusyCancel] = useState(false);

    /*Reschedule State*/
    const [rescheduleOpen, setRescheduleOpen] = useState(false);
    const [rescheduleApptId, setRescheduleApptId] = useState(null);
    const [newDate, setNewDate] = useState(null);       // Date object
    const [newTime, setNewTime] = useState("09:00");    // "HH:mm"
    const [busyReschedule, setBusyReschedule] = useState(false);

    /*Available Slotts state*/
    const [availableSlots, setAvailableSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [slotsMsg, setSlotsMsg] = useState("")

    /* Combine date + time into ISO string for backend */
    const buildISODateTime = (dateObj, timeStr) => {
        if (!dateObj || !timeStr) return null;
        const [hh, mm] = timeStr.split(":").map(Number);
        const combined = new Date(dateObj);
        combined.setHours(hh, mm, 0, 0);
        return combined.toISOString();
    };

    /*Fetch appointments when tab changes*/
    useEffect(() => {
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setErr("");

            const filter = activeTab === "upcoming" ? "future" : "past";

            const r = await apiClient.get(`/appointments/user?filter=${filter}`,
                {withCredentials: true}
            );

            //Backend rtrns array
            setAppointments(Array.isArray(r.data) ? r.data : []);
        } catch (e) {
            setErr(
                e?.response?.data?.message || e.message || "Failed to load appointments");
        } finally {
            setLoading(false)
        }
    };
    fetchAppointments();
   }, [activeTab]);
const mappedAppointments = useMemo(() => {
        return appointments.map((a) =>  {
            const start = new Date(a.date);

            //YYYY-MM-DD format
            const dateStr = format(start, "yyyy-MM-dd");

            //local time string
            const timeStr = start.toLocaleTimeString("en-US", {hour: "numeric",minute: "2-digit",});

            return {
                id: a.id,
                service: a.service?.name ?? "Service",
                stylist: a.stylist?.name ?? "Stylist",
                stylistId: a.stylist?.id ?? null,
                serviceId: a.service?.id ?? null,
                date: dateStr,
                time: timeStr,
                price: a.service?.price ?? 0,
            }
        })

    }, [appointments]);

    //Fetch avaliable slots for when reschedule modal is open
    useEffect(() => {
        const fetchSlots = async () => {
            //Only run when nodal open
            if (!rescheduleOpen || !rescheduleApptId || !newDate) return

            //Find appnt cx is rescheduling
            const appt = mappedAppointments.find((a) => a.id === rescheduleApptId);
            const stylistId = appt?.stylistId;
            const serviceId = appt?.serviceId;

            if (!stylistId || !serviceId) return;

            const dateStr = newDate.toISOString().slice(0, 10); //YYYY-MM-DD

            try {
                setSlotsLoading(true);
                setSlotsMsg("");
                setAvailableSlots([]);

                const r = await apiClient.get(`/stylists/${stylistId}/available-slots`,
                    {
                        params: {
                            date: 
                            dateStr, 
                            serviceId, 
                        },
                        withCredentials: true
                    }
                );

                setAvailableSlots(r.data?.availableSlots || []);
                if (r.data?.message) {
                    setSlotsMsg(r.data.message);
                }
            } catch (e) {
                setSlotsMsg(e.response?.data?.message || e.message || "Failed to load available slots");
            } finally {
                setSlotsLoading(false)
            }
        };
        fetchSlots();
    }, [rescheduleOpen, rescheduleApptId, newDate, appointments]);


    /*split mapped appointments into upcoming vs past*/
    const upcomingAppointments = useMemo(() => {
        if (activeTab !== "upcoming") return [];
        return [...mappedAppointments].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [mappedAppointments, activeTab]);

    const pastAppointments = useMemo(() => {
        if (activeTab !== "past") return [];
        return [...mappedAppointments].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [mappedAppointments, activeTab])

    /*When user clicks 'Cancel' open modal and store appointment id*/
    const handleCancelAppointment = (id) => {
        setSelectedAppointmentId(id);
        setShowCancelModal(true);
    };

    /*Confirm cancelation / call dlt from backend to remove it*/
    const confirmCancel = async () => {
        if (!selectedAppointmentId) return;

        try {
            setBusyCancel(true);
            
            await apiClient.delete(`/appointments/${selectedAppointmentId}`, {
                withCredentials: true
            });

            //Remove from state
            setAppointments((prev) => prev.filter((a) => a.id !== selectedAppointmentId));

            //Close modal + reset
            setShowCancelModal(false);
            setSelectedAppointmentId(null);
        } catch (e) {
            setErr(e?.response?.data?.message || e.message || "Failed tp cancel appointment")
        } finally {
            setBusyCancel(false)
        }
    };
    const openReschedule = (appointment) => {
        setRescheduleApptId(appointment.id);
    
        //Prefill w/ current appointment date & time
        const currentStart = new Date(`${appointment.date}T00:00:00`)
        setNewDate(currentStart)

        setNewTime("");

        setAvailableSlots([]);
        setSlotsMsg("")

        setRescheduleOpen(true)
    };
    /*Confirm reschedule*/ 
    const confirmReschedule = async () => {
        if (!rescheduleApptId) return;

        const iso = buildISODateTime(newDate, newTime);
        if (!iso) {
            setErr("Please select a date and time");
            return;
        }
        try {
            setBusyReschedule(true);
            setErr("")

            const r = await apiClient.put(`/appointments/${rescheduleApptId}`,
                {date: iso},
                {withCredentials: true}
            );
            const updated = r.data.appointment;
            
            //update local state so ui refreshes without refetch
            setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated: a)));

            setRescheduleOpen(false);
            setRescheduleApptId(null);
        } catch (e) {
            setErr(e?.response?.data?.message || e.message || "Failed to rescheule")
        } finally {
            setBusyReschedule(false);
        }
    }

 
    /*Helper function to display date string*/
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const formatSlotLabel = (slot) => {
        const [hh, mm] = slot.split(":").map(Number);
        const d = new Date();
        d.setHours(hh,mm, 0, 0);
        return d.toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit"});
         
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 bg-white">
            {/*Header*/}
            <div className="mb-8">
                <h1 className="text-4xl mb-2">My Appointments</h1>
                <p className="text-gray-600">Manage your upcoming and past appointments</p>
            </div>

            {err && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    {err}
                </div>
            )}
                {/*Tabs*/}
                <div className="flex gap-4 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`pb-4 px-2 relative transition-colors cursor-pointer ${activeTab === "upcoming" ? "text-purple-600" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        <span className="flex items-center gap-2">
                            <CalendarClock className="w-5 h-5" />
                            Upcoming ({loading && activeTab === "upcoming" ? "..." : upcomingAppointments.length})
                        </span>
                        {/*Underline when active*/}
                        {activeTab === "upcoming" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"/>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("past")}
                        className={`pb-4 px-2 relative transition-colors cursor-pointer ${activeTab === "past" ? "text-purple-600" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        <span className="flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5" />
                            Past ({loading && activeTab === "past" ? "..." : pastAppointments.length})
                        </span>
                        {activeTab === "past" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"/>
                        )}
                    </button>
                </div>
                
                {/*Loading State*/}
                {loading && <div className="text-gray-500">Loading appointments...</div>}

                {/*Appointments List*/}
                {!loading && (
                    <div className="space-y-4">
                    {/*upcoming*/}
                    {activeTab === "upcoming" && upcomingAppointments.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p>No upcoming appointments</p>
                        </div>
                    )}
                    {activeTab === "upcoming" &&
                        upcomingAppointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                            >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                {/* Left side info */}
                                <div className="flex-1">
                                    <h3 className="text-xl mb-3">{appointment.service}</h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="w-4 h-4 text-purple-500" />
                                            <span>{formatDate(appointment.date)}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-purple-500" />
                                            <span>{appointment.time}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-purple-500" />
                                            <span>{appointment.stylist}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Scissors className="w-4 h-4 text-purple-500" />
                                            <span>${appointment.price}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right side buttons */}
                                <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                    className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                                    onClick={() => openReschedule(appointment)}
                                >
                                    Reschedule
                                </button>

                                <button
                                    onClick={() => handleCancelAppointment(appointment.id)}
                                    className="px-6 py-2.5 border border-red-600 text-gray-700 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Past */}
                {activeTab === "past" && pastAppointments.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p>No past appointments</p>
                    </div>
                )}

                {activeTab === "past" &&
                    pastAppointments.map((appointment) => (
                        <div
                            key={appointment.id}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 opacity-75"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="text-xl mb-3">{appointment.service}</h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                                            <span>{formatDate(appointment.date)}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span>{appointment.time}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span>{appointment.stylist}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Scissors className="w-4 h-4 text-gray-400" />
                                            <span>${appointment.price}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button
                                        className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                        onClick={() => alert("Hook this to your booking flow")}
                                    >
                                        Book Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
        </div>
        
        )}

        {/*Reschedule Modal*/}
        {rescheduleOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl">Reschedule Appointment</h3>
                        <button
                            onClick={() => setRescheduleOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                            disabled={busyReschedule}
                        >
                            <X className="w-6 h-6"/>
                        </button>
                    </div>

                    {/*Date input*/}
                    <label className="block text-sm text-gray-600 mb-1">New Date</label>
                
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-12 justify-start text-left font-normal cursor-pointer mb-4"
                                disabled={busyReschedule}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                {newDate ?format(newDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={newDate}
                                onSelect={(d) => {
                                    if (!d) return;
                                    setNewDate(d);
                                    setNewTime("");
                                }}
                                //Disable days before today
                                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {/*Time Slots*/}
                    <label className="block text-sm text-gray-600 mb-2">Pick a Time</label>
                    {slotsLoading && <div className="text-gray-500 mb-4">Loading slots...</div>}

                    {!slotsLoading && slotsMsg && (
                        <div className="text-sm text-gray-500 mb-4">{slotsMsg}</div>
                    )}

                    {!slotsLoading && availableSlots.length === 0 && (
                        <div className="text-sm text-gray-500 mb-4">
                            No available slots for this day
                        </div>
                    )}

                    {availableSlots.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-6">
                            {availableSlots.map((slot) => (
                                <button
                                    key={slot}
                                    type="button"
                                    onClick={() => setNewTime(slot)}
                                    className={`px-3 py-2 rounded-lg border text-sm cursor-pointer transition 
                                        ${newTime === slot
                                            ? "bg-purple-600 text-white border-purple-600"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    {formatSlotLabel(slot)}
                                </button>
                            ))}
                        </div>
                    )}


                    <div className="flex gap-3">
                        <button
                            onClick={() => setRescheduleOpen(false)}
                            className="flex-1 px-6 py-2.5 border border-red-600 text-gray-700 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            disabled={busyReschedule}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmReschedule}
                            className="flex-1 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                            disabled={busyReschedule || !newDate || !newTime}
                        >
                            {busyReschedule ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
                
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl">Cancel Appointment</h3>
                        <button
                            onClick={() => setShowCancelModal(false)}
                            className="text-gray-400 hover:text-gray-600"
                            disabled={busyCancel}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <p className="text-gray-600 mb-6">
                        Are you sure you want to cancel this appointment? This action cannot be undone.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowCancelModal(false)}
                            className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            disabled={busyCancel}
                        >
                            Keep Appointment
                        </button>
                        <button
                            onClick={confirmCancel}
                            className="flex-1 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                            disabled={busyCancel}
                        >
                            {busyCancel ? "Cancelling…" : "Cancel Appointment"}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </div>
    );
}