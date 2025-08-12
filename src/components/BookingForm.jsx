import React from 'react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';

export default function BookingForm({ open, onClose, bookingStatus, bookingError, handleClientSubmit }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
      <div className="container mx-auto px-4 py-8">
        <button onClick={onClose} className="mb-4 text-sm text-gray-500 hover:text-gray-700">Close</button>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Book a Speaker</h1>
            <p className="text-lg text-gray-600">Connect with Africa's most compelling voices for your next event</p>
          </div>
          <Card>
            <CardContent className="p-8">
              {bookingStatus === 'success' ? (
                <div className="rounded-xl bg-green-50 text-green-800 p-4 border border-green-200">
                  <p className="font-medium">Thank you — we’ve received your booking request.</p>
                  <p>We’ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleClientSubmit} className="space-y-8">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name *</label>
                        <Input name="firstName" placeholder="Your first name" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name *</label>
                        <Input name="lastName" placeholder="Your last name" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address *</label>
                        <Input name="email" type="email" placeholder="your.email@example.com" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number *</label>
                        <Input name="phone" placeholder="+1 (555) 123-4567" required />
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Company Name *</label>
                        <Input name="companyName" placeholder="Your company name" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Job Title *</label>
                        <Input name="jobTitle" placeholder="Your job title" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Company Size</label>
                        <select name="companySize" className="w-full p-2 border border-gray-300 rounded-md">
                          <option value="">Select company size</option>
                          <option value="1 - 10 employees">1 - 10 employees</option>
                          <option value="11 - 50 employees">11 - 50 employees</option>
                          <option value="51 - 250 employees">51 - 250 employees</option>
                          <option value="251 - 500 employees">251 - 500 employees</option>
                          <option value="501 - 1000 employees">501 - 1000 employees</option>
                          <option value="1000 + employees">1000 + employees</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Industry</label>
                        <select name="industry" className="w-full p-2 border border-gray-300 rounded-md">
                          <option value="">Select industry</option>
                          <option value="Technology">Technology</option>
                          <option value="Finance & Banking">Finance & Banking</option>
                          <option value="Healthcare & Medical">Healthcare & Medical</option>
                          <option value="Education">Education</option>
                          <option value="Government & Public Policy">Government & Public Policy</option>
                          <option value="Non Profit and NGO">Non Profit and NGO</option>
                          <option value="Energy and Mining">Energy and Mining</option>
                          <option value="Agriculture & Food">Agriculture & Food</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Telecommunications">Telecommunications</option>
                          <option value="Transport & Logistics">Transport & Logistics</option>
                          <option value="Real Estate & Construction">Real Estate & Construction</option>
                          <option value="Media & Entertainment">Media & Entertainment</option>
                          <option value="Tourism & Hospitality">Tourism & Hospitality</option>
                          <option value="Retail and Consumer Goods">Retail and Consumer Goods</option>
                          <option value="Legal Services">Legal Services</option>
                          <option value="Consulting">Consulting</option>
                          <option value="Research and Development">Research and Development</option>
                          <option value="Arts and Cultures">Arts and Cultures</option>
                          <option value="IT & AI">IT & AI</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Company Website</label>
                        <Input name="website" placeholder="https://yourcompany.com" />
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Event Details</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Event Name *</label>
                          <Input name="eventName" placeholder="Name of your event" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Event Date</label>
                          <Input name="eventDate" type="date" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Event Location *</label>
                          <Input name="eventLocation" placeholder="e.g. New York, USA or Virtual Event" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Expected Audience Size</label>
                          <select name="audienceSize" className="w-full p-2 border border-gray-300 rounded-md">
                            <option value="">Select audience size</option>
                            <option value="Less than 50">Less than 50</option>
                            <option value="50-100">50-100</option>
                            <option value="100-500">100-500</option>
                            <option value="500-1000">500-1000</option>
                            <option value="More than 1000">More than 1000</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Speaking Topic/Theme *</label>
                        <Textarea name="topic" placeholder="Describe the topic or theme you'd like the speaker to address" required />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Budget Range (USD)</label>
                          <select name="budget" className="w-full p-2 border border-gray-300 rounded-md">
                            <option value="">Select budget range</option>
                            <option value="Less than $1 000 / R20 000">Less than $1 000 / R20 000</option>
                            <option value="$1 000-$2 500 / R20 000 - R50 000">$1 000-$2 500 / R20 000 - R50 000</option>
                            <option value="$2 500-$5 000 / R50000 - R100 000">$2 500-$5 000 / R50000 - R100 000</option>
                            <option value="$5 000 - $10 000 / R100 000 - R200 000">$5 000 - $10 000 / R100 000 - R200 000</option>
                            <option value="More than $10 000 / R200 000">More than $10 000 / R200 000</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Presentation Format</label>
                          <select name="format" className="w-full p-2 border border-gray-300 rounded-md">
                            <option value="">Select format</option>
                            <option value="Virtual">Virtual</option>
                            <option value="In-Person">In-Person</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Additional Requirements</label>
                        <Textarea name="requirements" placeholder="Any specific requirements, preferences, or additional information" />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={bookingStatus === 'loading'}>
                    {bookingStatus === 'loading' ? 'Submitting...' : 'Submit Booking Request'}
                  </Button>
                  {bookingStatus === 'error' && (
                    <p className="mt-3 text-sm text-red-600">{bookingError}</p>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
