import React from "react";
import {format} from "date-fns"
import {Search, Calendar as CalendarIcon, User, Sparkles} from "lucide-react"

import {Button} from "@/Components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"

import {Label} from "@/Components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger, 
    SelectValue,
} from "@/Components/ui/select"
import {Popover, PopoverContent, PopoverTrigger} from "@/Components/ui/popover"
import {Calendar} from "@/Components/ui/calendar"

export default function BookingForm ({
    services,
    stylists,

    selectedServiceId,
    setSelectedServiceId,

    selectedStylistId,
    setSelectedStylistId,

    selectedDate,
    setSelectedDate,

    onSearch,
    searching,

    loadingServices,
    loadingStylist,
    disableStylistSelect,
}) { 
    const canSearch = Boolean(selectedServiceId && selectedStylistId && selectedDate);

    console.log("BookingForm onSearch:", onSearch, typeof onSearch);

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 border-b">
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sparkles className="w-6 h-6 text-pink-600"/>
                    Book Your Appointment
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/*Service Select*/}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            Service
                        </Label>

                        <Select 
                            value={selectedServiceId || ""}
                            onValueChange={(val) => setSelectedServiceId(val)}
                            disabled={loadingServices}
                        >
                            <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select a service" />
                            </SelectTrigger>

                            <SelectContent>
                              {(services || []).map((s) => (
                                <SelectItem key={s._id} value={s._id}>
                                    {s.name} - ${s.price}
                                </SelectItem>
                              ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/*Stylist Select*/}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <User className="w-4 h-4 text-pink-600" />
                            Stylist
                        </Label>

                        <Select
                            value={selectedStylistId || ""}
                            onValueChange={(val) => setSelectedStylistId(val)}
                            disabled={loadingStylist || disableStylistSelect}
                        >
                            <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select a stylits"/>
                            </SelectTrigger>

                            <SelectContent>
                                {(stylists || []).map((st) => (
                                    <SelectItem key={st._id} value={st._id}>
                                        {st.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date Picker*/}
                    <div className="space-y-2 md:col-span-2">
                        <Label className="flex items-center gap-2">
                            <CalendarIcon className="w-4 text-pink-600" />
                            Date
                        </Label>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full h-12 justify-start text-left font-normal"
                                    disabled={!selectedServiceId || !selectedStylistId}
                                >
                                    <CalendarIcon className="w-full h-12 justify-start text-left font-normal"/>
                                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(d) => d && setSelectedDate(d)}
                                    disabled={(d) => d < new Date ()}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    {/*Search Button*/}
                    <div className="md:col-span-2">
                        <Button
                            className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white"
                            size="lg"
                            disabled={!canSearch || searching}
                        >
                            <Search className="w-5 h-5 mr-2" />
                            {searching ? "Searching..." : "Search Available Times"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}