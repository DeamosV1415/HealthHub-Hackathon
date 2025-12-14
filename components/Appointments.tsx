import React, { useState } from 'react';
import { Search, MapPin, Star, Video, Calendar, Clock, ChevronLeft, CheckCircle, MoreVertical } from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  image: string;
  nextAvailable: string;
  location: string;
  price: string;
}

const doctors: Doctor[] = [
  { id: 1, name: 'Dr. Anadhya', specialty: 'General Practitioner', rating: 4.9, reviews: 124, image: 'https://picsum.photos/id/1062/200/200', nextAvailable: 'Today', location: 'HealthHub Central', price: '$150' },
  { id: 2, name: 'Dr. Harsh', specialty: 'Cardiologist', rating: 4.8, reviews: 89, image: 'https://picsum.photos/id/1025/200/200', nextAvailable: 'Tomorrow', location: 'Heart Center', price: '$200' },
  { id: 3, name: 'Dr. Kavya', specialty: 'Dermatologist', rating: 4.9, reviews: 210, image: 'https://picsum.photos/id/338/200/200', nextAvailable: 'Thu, Oct 26', location: 'Skin Clinic', price: '$180' },
  { id: 4, name: 'Dr. Harsh', specialty: 'Orthopedist', rating: 4.7, reviews: 76, image: 'https://picsum.photos/id/1074/200/200', nextAvailable: 'Fri, Oct 27', location: 'Bone & Joint', price: '$220' },
  { id: 5, name: 'Dr. Kavya', specialty: 'Neurologist', rating: 5.0, reviews: 150, image: 'https://picsum.photos/id/64/200/200', nextAvailable: 'Mon, Oct 30', location: 'Neuro Institute', price: '$250' },
];

const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:30 PM', '03:00 PM', '04:15 PM'];

const Appointments: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingStep, setBookingStep] = useState<'list' | 'time' | 'confirm'>('list');
  const [selectedDate, setSelectedDate] = useState<string>('Today');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setBookingStep('time');
  };

  const handleConfirm = () => {
    setBookingStep('confirm');
  };

  const handleReset = () => {
    setSelectedDoctor(null);
    setBookingStep('list');
    setSelectedTime(null);
  };

  if (bookingStep === 'confirm') {
    return (
      <div className="flex-1 bg-health-bg min-h-screen pb-20 md:pb-0 md:ml-64 p-4 md:p-8 overflow-y-auto flex items-center justify-center">
        <div className="bg-health-card max-w-md w-full p-8 rounded-3xl border border-white/5 text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Appointment Confirmed!</h2>
          <p className="text-gray-400 mb-8">Your appointment has been successfully booked. A confirmation email has been sent to you.</p>
          
          <div className="bg-white/5 rounded-2xl p-4 mb-8 text-left">
            <div className="flex items-center gap-4 mb-4 border-b border-white/5 pb-4">
              <img src={selectedDoctor?.image} alt={selectedDoctor?.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h4 className="font-bold text-white">{selectedDoctor?.name}</h4>
                <p className="text-xs text-emerald-400">{selectedDoctor?.specialty}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>{selectedDate === 'Today' ? 'Oct 24, 2023' : selectedDate}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>{selectedTime}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Video className="w-4 h-4 text-gray-500" />
                <span>Video Consultation</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleReset}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-health-bg font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-health-bg min-h-screen pb-20 md:pb-0 md:ml-64 p-4 md:p-8 overflow-y-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">
            {bookingStep === 'time' ? 'Select Date & Time' : 'Find a Specialist'}
          </h2>
          <p className="text-health-muted">
            {bookingStep === 'time' ? `Booking with ${selectedDoctor?.name}` : 'Book an appointment with top doctors'}
          </p>
        </div>
        
        {bookingStep === 'time' && (
           <button onClick={() => setBookingStep('list')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-xl border border-white/10">
              <ChevronLeft className="w-4 h-4" />
              Back to List
           </button>
        )}

        {bookingStep === 'list' && (
           <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search doctor, specialty..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-health-card border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-gray-600 text-sm"
                />
            </div>
        )}
      </header>

      {bookingStep === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Doctors List */}
            <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-bold text-white mb-2">Available Doctors</h3>
                {filteredDoctors.map((doc) => (
                    <div key={doc.id} className="bg-health-card p-4 md:p-6 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col md:flex-row items-start md:items-center gap-6 group">
                        <div className="relative">
                             <img src={doc.image} alt={doc.name} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover" />
                             <div className="absolute -bottom-2 -right-2 bg-health-card p-1 rounded-lg">
                                 <div className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-md">
                                     <Video className="w-4 h-4" />
                                 </div>
                             </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{doc.name}</h4>
                                    <p className="text-health-muted text-sm mb-2">{doc.specialty}</p>
                                </div>
                                <div className="text-right hidden md:block">
                                    <p className="text-emerald-400 font-bold text-lg">{doc.price}</p>
                                    <p className="text-[10px] text-gray-500">per visit</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <span className="text-white font-medium">{doc.rating}</span>
                                    <span className="text-xs">({doc.reviews})</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span>{doc.location}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <div className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-gray-300">
                                    Next Available: <span className="text-emerald-400 font-bold ml-1">{doc.nextAvailable}</span>
                                </div>
                                <button 
                                    onClick={() => handleBookClick(doc)}
                                    className="bg-emerald-500 hover:bg-emerald-400 text-health-bg font-bold py-2 px-6 rounded-xl transition-colors text-sm"
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Upcoming / Sidebar */}
            <div className="space-y-6">
                 <div className="bg-health-card p-6 rounded-3xl border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white">Upcoming</h3>
                        <Calendar className="w-5 h-5 text-gray-500" />
                    </div>
                    
                    <div className="space-y-4">
                        {/* Mock Upcoming Appointment */}
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl">
                                    <Video className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">General Checkup</h4>
                                    <p className="text-xs text-emerald-400">Tomorrow • 10:00 AM</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <img src="https://picsum.photos/id/1062/50/50" className="w-6 h-6 rounded-full" alt="Doctor" />
                                <span className="text-xs text-gray-300">Dr. Anadhya</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 bg-emerald-500 text-health-bg text-xs font-bold py-2 rounded-lg hover:bg-emerald-400 transition-colors">Join</button>
                                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                 </div>

                 <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-900/20 to-teal-900/10 border border-emerald-500/20">
                    <h3 className="font-bold text-white mb-2">Need Help?</h3>
                    <p className="text-sm text-gray-400 mb-4">Not sure which specialist to choose? Use our AI Triage to get a recommendation.</p>
                    <button className="text-sm font-bold text-emerald-400 hover:text-emerald-300">Start Triage &rarr;</button>
                 </div>
            </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Time Selection */}
             <div className="lg:col-span-2 space-y-8">
                {/* Doctor Summary */}
                <div className="bg-health-card p-6 rounded-3xl border border-white/5 flex items-center gap-6">
                     <img src={selectedDoctor?.image} alt={selectedDoctor?.name} className="w-20 h-20 rounded-2xl object-cover" />
                     <div>
                        <h3 className="text-xl font-bold text-white">{selectedDoctor?.name}</h3>
                        <p className="text-emerald-400">{selectedDoctor?.specialty}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {selectedDoctor?.rating}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedDoctor?.location}</span>
                        </div>
                     </div>
                </div>

                {/* Calendar Strip */}
                <div>
                    <h4 className="text-white font-bold mb-4">Select Date</h4>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {['Today', 'Tomorrow', 'Thu, 26', 'Fri, 27', 'Sat, 28', 'Mon, 30'].map((day) => (
                            <button 
                                key={day}
                                onClick={() => setSelectedDate(day)}
                                className={`min-w-[100px] p-4 rounded-2xl border transition-all text-center ${
                                    selectedDate === day 
                                    ? 'bg-emerald-500 text-health-bg border-emerald-500 font-bold' 
                                    : 'bg-health-card border-white/5 text-gray-400 hover:border-white/20'
                                }`}
                            >
                                <span className="block text-xs opacity-70 mb-1">{day === 'Today' || day === 'Tomorrow' ? 'Oct 24' : 'Oct'}</span>
                                <span className="block text-lg">{day === 'Today' ? '24' : day.split(' ')[1] || day}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Grid */}
                <div>
                    <h4 className="text-white font-bold mb-4">Available Time</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {timeSlots.map((time) => (
                            <button 
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                                    selectedTime === time
                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                    : 'bg-health-card border-white/5 text-gray-300 hover:bg-white/5 hover:border-white/10'
                                }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>
             </div>

             {/* Order Summary */}
             <div className="bg-health-card p-6 rounded-3xl border border-white/5 h-fit">
                <h3 className="font-bold text-white mb-6">Booking Summary</h3>
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Date</span>
                        <span className="text-white font-medium">{selectedDate === 'Today' ? 'Oct 24, 2023' : selectedDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Time</span>
                        <span className="text-white font-medium">{selectedTime || '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Consultation Fee</span>
                        <span className="text-white font-medium">{selectedDoctor?.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Booking Fee</span>
                        <span className="text-white font-medium">$10</span>
                    </div>
                    <div className="border-t border-white/10 pt-4 flex justify-between">
                        <span className="text-white font-bold">Total</span>
                        <span className="text-emerald-400 font-bold text-lg">
                            {selectedDoctor ? `$${parseInt(selectedDoctor.price.replace('$','')) + 10}` : '-'}
                        </span>
                    </div>
                </div>
                
                <button 
                    disabled={!selectedTime}
                    onClick={handleConfirm}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-health-bg font-bold py-3 px-4 rounded-xl transition-colors"
                >
                    Confirm Booking
                </button>
             </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;