import React from "react";
import {Calendar, Clock, User, CheckCircle2, X} from "lucide-react"
import {format} from "date-fns"
import { Card, CardContent } from "./ui/card";
import {Button} from "./ui/button"
import {Alert, AlertDescription} from "./ui/alert"

export default function ConfirmationPanel ({
    selectedDate,
    selectedTimeLabel,
    stylistName,
    serviceName,
    onConfirm,
    onCancel,
    confirming,
    errorMessage,
}) {
    return (
        <Card className="w-full max-w-4xl mx-auto shadow-lg border-2 border-pink-200">
            <CardContent className="pt-6">
                <Alert className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
                    <CheckCircle2 className="h-5 w-5 text-pink-600"/>
                    <AlertDescription>
                        <div className="space-y-3">
                            <p className="font-semibold text-gray-900">Confirm your appointment</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Calendar className="w-4 h-4 text-pink-600" />
                                    <span>{selectedDate ? format(selectedDate, "PPP") : ""}</span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Clock className="w-4 h-4 text-pink-600"/>
                                    <span>{selectedTimeLabel}</span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-700">
                                    <User className="w-4 h-4 text-pink-600" />
                                    <span>{stylistName}</span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-700 sm:col-span-2">
                                    <CheckCircle2 className="w-4 h-4 text-pink-600" />
                                    <span>{serviceName}</span>
                                </div>
                            </div>

                            {/*Error message from booking aattempt*/}
                            {errorMessage ? (
                                <p className="text-sm text-red-600">{errorMessage}</p>
                            ) : null}

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={onCancel}
                                    className="flex-1 border-gray-300 hover:bg-gray-50 cursor-pointer"
                                    disabled={confirming}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>

                                <Button
                                    onClick={onConfirm}
                                    className="flex-1 bg-pink-600 hover:bg-pink-700 text-white cursor-pointer"
                                    disabled={confirming}
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    {confirming ? "Booking..." : "Confirm Appointment"}
                                </Button>
                            </div>
                        </div>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
}