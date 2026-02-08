import React from "react";
import {Clock, Sunrise, Sun, Moon} from "lucide-react"
import {Card, CardContent, CardHeader, CardTitle} from "@/Components/ui/card"
import {Button} from "@/Components/ui/button"
import {Badge} from "@/Components/ui/badge"

export default function TimeSlotSelector({
    staffName,
    serviceName,
    groupedSlots,
    selectedSlot,
    onSelectedSlot,
    to12h,
}) {
    const Groups = [
        {key: "Morning", label: "Morning", Icon: Sunrise},
        {key: "Afternoon", label:"Afternoon", Icon: Sun},
        {key: "Evening", label:"Evening", Icon: Moon},
    ];
    
    return (
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
            <CardHeader className="border-b pt-4 bg-gradient-to-r from-pink-50 to-purple-50">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">{staffName}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{serviceName}</p>
                    </div>

                    <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                        Available Times
                    </Badge>
                </div>
            </CardHeader>
            
            <CardContent className="pt-6">
                <div className="space-y-6">
                    {Groups.map(({key, label, Icon}) => (
                        <div key={key}>
                            <h3 className="flex items-center gap-2 mb-3 font-medium text-gray-700 ">
                                <Icon className="w-5 h-5"/>
                                {label}
                            </h3>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {(groupedSlots?.[key] || []).map((slot) => (
                                    <Button
                                        key={slot}
                                        variant={selectedSlot === slot ? "default" : "outline"}
                                        className={
                                            selectedSlot === slot
                                                ? "h-12 bg-pink-600 hover:bg-pink-700 text-white cursor-pointer"
                                                : "h-12 hover:bg-pink-50 hover:border-pink-300 cursor-pointer"
                                        }
                                        onClick={() => onSelectedSlot(slot)}
                                    >
                                        <Clock className="w-4 h-4 mr-2" />
                                        {to12h(slot)}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
