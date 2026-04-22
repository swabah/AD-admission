import { Link } from "react-router-dom";
import { ArrowRight, FileText, Search, Phone, Calendar, ClipboardList } from "lucide-react";
import logo from "../assets/logo.jpg";

const ApplyPage = () => {
 return (
 <div className="min-h-screen bg-[#faf8f5] text-[#0a1628] font-body selection:bg-[#c8922a] selection:text-white">
 {/* Hero Section */}
 <section className="relative overflow-hidden bg-gradient-to-b from-[#0a1628] to-[#132238] pt-24 pb-32">
 {/* Decorative background elements */}
 <div className="absolute inset-0 overflow-hidden pointer-events-none">
 <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(200,146,42,0.15),transparent_70%)] blur-3xl" />
 <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(29,111,164,0.15),transparent_70%)] blur-3xl" />
 <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#c8922a]/50 to-transparent" />
 </div>

 <div className="container mx-auto px-6 relative z-10">
 <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
 <div className="w-24 h-24 mb-8 rounded-2xl bg-white/5 border border-[#c8922a]/30 p-3 backdrop-blur-md overflow-hidden flex items-center justify-center">
 <img src={logo} alt="Ahlussuffa Logo" className="w-full h-full object-contain filter invert brightness-0" />
 </div>
 
 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c8922a]/10 border border-[#c8922a]/20 text-[#e8b86d] text-sm font-semibold uppercase tracking-wider mb-6 backdrop-blur-sm">
 <span className="w-2 h-2 rounded-full bg-[#e8b86d] animate-pulse "></span>
 Admissions Open 2026–27
 </div>

 <h1 className="text-5xl md:text-7xl font-bold font-display text-white mb-6 tracking-tight drop-shadow-sm">
 Ahlussuffa Dars
 </h1>
 
 <p className="text-xl md:text-2xl text-slate-300 mb-2 font-light">
 Where Faith Meets Knowledge
 </p>
 <p className="text-slate-400 font-medium tracking-wide uppercase text-sm mb-12 flex items-center gap-2 justify-center">
 <span className="w-8 h-px bg-slate-600"></span>
 Kannur, Kerala
 <span className="w-8 h-px bg-slate-600"></span>
 </p>
 </div>
 </div>

 <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 animate-bounce">
 <span className="text-xs uppercase tracking-widest font-semibold">Explore</span>
 <ArrowRight className="w-4 h-4 rotate-90" />
 </div>
 </section>

 {/* Admission Options Section */}
 <section className="py-24 relative z-20 -mt-10">
 <div className="container mx-auto px-6 max-w-6xl">
 <div className="text-center mb-16">
 <h2 className="text-sm font-bold tracking-widest text-[#c8922a] uppercase mb-3">Get Started</h2>
 <h3 className="text-4xl font-display font-bold text-[#0a1628] mb-4">Choose Your Path</h3>
 <p className="text-slate-600 max-w-2xl mx-auto text-lg">
 Select the admission type that best describes your situation to begin your application process.
 </p>
 </div>

 <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
 {/* New Admission Card */}
 <Link to="/apply/new" className="group relative bg-white rounded-3xl p-8 border border-slate-200 shadow-sm shadow-slate-200/50 hover:shadow-sm hover: hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full">
 <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#c8922a]/10 to-transparent rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-500 group-hover:scale-150" />
 
 <div className="w-16 h-16 rounded-2xl bg-[#0a1628] text-white flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
 <FileText className="w-8 h-8" />
 </div>
 
 <h3 className="text-3xl font-display font-bold text-[#0a1628] mb-4">New Admission</h3>
 <p className="text-slate-600 mb-8 leading-relaxed flex-grow">
 For first-time applicants joining Ahlussuffa Dars. Complete our comprehensive application form to begin your journey with us.
 </p>
 
 <ul className="space-y-4 mb-10 text-slate-700 font-medium">
 <li className="flex items-center gap-3">
 <div className="w-6 h-6 rounded-full bg-[#e8f4fb] text-[#1d6fa4] flex items-center justify-center text-sm">✓</div>
 Full application process
 </li>
 <li className="flex items-center gap-3">
 <div className="w-6 h-6 rounded-full bg-[#e8f4fb] text-[#1d6fa4] flex items-center justify-center text-sm">✓</div>
 All classes available
 </li>
 <li className="flex items-center gap-3">
 <div className="w-6 h-6 rounded-full bg-[#e8f4fb] text-[#1d6fa4] flex items-center justify-center text-sm">✓</div>
 Document upload required
 </li>
 </ul>
 
 <div className="inline-flex items-center justify-between w-full p-4 rounded-xl bg-slate-50 text-[#0a1628] font-bold group-hover:bg-[#0a1628] group-hover:text-white transition-colors duration-300">
 <span>Apply Now</span>
 <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
 </div>
 </Link>

 {/* Local Admission Card */}
 <Link to="/apply/local" className="group relative bg-white rounded-3xl p-8 border border-slate-200 shadow-sm shadow-slate-200/50 hover:shadow-sm hover: hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full">
 <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#1d6fa4]/10 to-transparent rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-500 group-hover:scale-150" />
 
 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c8922a] to-[#a37521] text-white flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
 <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
 </svg>
 </div>
 
 <h3 className="text-3xl font-display font-bold text-[#0a1628] mb-4">Local / Re-admission</h3>
 <p className="text-slate-600 mb-8 leading-relaxed flex-grow">
 For existing students continuing their studies. Experience a quick re-enrollment process with simplified form fields.
 </p>
 
 <ul className="space-y-4 mb-10 text-slate-700 font-medium">
 <li className="flex items-center gap-3">
 <div className="w-6 h-6 rounded-full bg-[#fdf3e3] text-[#c8922a] flex items-center justify-center text-sm">✓</div>
 Fast-track process
 </li>
 <li className="flex items-center gap-3">
 <div className="w-6 h-6 rounded-full bg-[#fdf3e3] text-[#c8922a] flex items-center justify-center text-sm">✓</div>
 Pre-filled information
 </li>
 <li className="flex items-center gap-3">
 <div className="w-6 h-6 rounded-full bg-[#fdf3e3] text-[#c8922a] flex items-center justify-center text-sm">✓</div>
 Priority enrollment
 </li>
 </ul>
 
 <div className="inline-flex items-center justify-between w-full p-4 rounded-xl bg-slate-50 text-[#0a1628] font-bold group-hover:bg-[#c8922a] group-hover:text-white transition-colors duration-300">
 <span>Re-enroll Now</span>
 <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
 </div>
 </Link>
 </div>
 </div>
 </section>

 {/* Locate Application Section */}
 <section className="py-16 bg-[#0a1628] relative overflow-hidden">
 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djI2SDI0VjM0SDJWMjRoMjJWMEgzNnYyNGgyMnYxMEgzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
 <div className="container mx-auto px-6 relative z-10">
 <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 md:p-12 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
 <div className="w-20 h-20 shrink-0 rounded-full bg-[#c8922a]/20 flex items-center justify-center border border-[#c8922a]/40 ">
 <Search className="w-10 h-10 text-[#e8b86d]" />
 </div>
 
 <div className="flex-grow text-center md:text-left">
 <h3 className="text-3xl font-display font-bold text-white mb-3">Already Applied?</h3>
 <p className="text-slate-300 text-lg max-w-2xl">
 Find your existing application using your mobile number and date of birth. View, print, or download your application form anytime.
 </p>
 </div>
 
 <Link to="/locate" className="shrink-0 whitespace-nowrap inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#c8922a] text-white font-bold text-lg hover:bg-[#b5801f] transition-colors shadow-sm hover:-translate-y-1 transform duration-200">
 <Search className="w-5 h-5" />
 <span>Find Application</span>
 </Link>
 </div>
 </div>
 </section>

 {/* Info Section */}
 <section className="py-24 bg-white">
 <div className="container mx-auto px-6 max-w-6xl">
 <div className="grid md:grid-cols-3 gap-8">
 <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center hover:shadow-sm transition-shadow">
 <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
 <Phone className="w-6 h-6" />
 </div>
 <h4 className="text-xl font-bold text-[#0a1628] mb-3">Need Help?</h4>
 <p className="text-slate-600">Contact our admissions office for assistance with your application.</p>
 </div>
 
 <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center hover:shadow-sm transition-shadow">
 <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-6">
 <Calendar className="w-6 h-6" />
 </div>
 <h4 className="text-xl font-bold text-[#0a1628] mb-3">Important Dates</h4>
 <p className="text-slate-600">Application deadline for the upcoming academic year: <span className="font-semibold text-[#0a1628]">March 31, 2026</span></p>
 </div>
 
 <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center hover:shadow-sm transition-shadow">
 <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
 <ClipboardList className="w-6 h-6" />
 </div>
 <h4 className="text-xl font-bold text-[#0a1628] mb-3">Requirements</h4>
 <p className="text-slate-600">Keep your documents ready: Passport Photo, ID proof, and Previous marksheets.</p>
 </div>
 </div>
 </div>
 </section>

 {/* Footer */}
 <footer className="py-12 bg-[#0a1628] text-center border-t border-white/10">
 <div className="container mx-auto px-6">
 <img src={logo} alt="Logo" className="w-12 h-12 mx-auto mb-6 filter invert brightness-0 opacity-50" />
 <p className="text-slate-400 mb-2">© 2026 Ahlussuffa Dars. All rights reserved.</p>
 <p className="text-[#c8922a] font-display italic tracking-wide">Where Faith Meets Knowledge</p>
 </div>
 </footer>
 </div>
 );
};

export default ApplyPage;

