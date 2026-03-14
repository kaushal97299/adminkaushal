/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
ResponsiveContainer,
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
PieChart,
Pie,
Cell,
LineChart,
Line
} from "recharts";

import {
Users,
Car,
ClipboardList,
AlertTriangle,
Mail,
IndianRupee
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDashboard(){
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const [users,setUsers] = useState<any[]>([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const [cars,setCars] = useState<any[]>([]);
const [bookings,setBookings] = useState<any[]>([]);
const [claims,setClaims] = useState<any[]>([]);
const [contacts,setContacts] = useState<any[]>([]);
const [sellers,setSellers] = useState<any[]>([]);
const [loading,setLoading] = useState(true);

const token =
typeof window !== "undefined"
? localStorage.getItem("admin_token")
: null;

useEffect(()=>{

const fetchData = async()=>{

try{

const [u,c,b,cl,ct,s] = await Promise.all([

axios.get(`${API}/api/admin/users`,{
headers:{Authorization:`Bearer ${token}`}
}),

axios.get(`${API}/api/admin/inventory`,{
headers:{Authorization:`Bearer ${token}`}
}),

axios.get(`${API}/api/booking/all`,{
headers:{Authorization:`Bearer ${token}`}
}),

axios.get(`${API}/api/admin/claims`,{
headers:{Authorization:`Bearer ${token}`}
}),

axios.get(`${API}/api/admin/contact`),

axios.get(`${API}/api/admin/kyc`,{
headers:{Authorization:`Bearer ${token}`}
})

]);

setUsers(u.data.users || []);
setCars(c.data || []);
setBookings(b.data || []);
setClaims(cl.data || []);
setContacts(ct.data || []);
setSellers(s.data || []);

}catch(err){
console.log(err);
}

setLoading(false);

};

fetchData();

},[token]);


/* ================= STATS ================= */

const totalUsers = users.length;
const totalCars = cars.length;
const totalBookings = bookings.length;
const totalClaims = claims.length;
const totalContacts = contacts.length;
const totalSellers = sellers.length;

const revenue = bookings
// eslint-disable-next-line @typescript-eslint/no-explicit-any
.filter((b:any)=>b.bookingStatus==="accepted")
// eslint-disable-next-line @typescript-eslint/no-explicit-any
.reduce((sum:number,b:any)=>sum + (b.amount || 0),0);


/* ================= MONTHLY BOOKINGS ================= */

const monthlyBookings = Array(12).fill(0);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
bookings.forEach((b:any)=>{
if(!b.createdAt) return;
const m = new Date(b.createdAt).getMonth();
monthlyBookings[m]++;
});

const bookingGraph = monthlyBookings.map((v,i)=>({
month:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
bookings:v
}));


/* ================= MONTHLY REVENUE ================= */

const monthlyRevenue = Array(12).fill(0);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
bookings.forEach((b:any)=>{
if(b.bookingStatus==="accepted" && b.createdAt){
const m = new Date(b.createdAt).getMonth();
monthlyRevenue[m]+=b.amount || 0;
}
});

const revenueGraph = monthlyRevenue.map((v,i)=>({
month:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
revenue:v
}));


/* ================= CLAIM STATUS ================= */

const claimStats = {

pending:claims.filter(c=>c.status==="pending").length,
approved:claims.filter(c=>c.status==="approved").length,
rejected:claims.filter(c=>c.status==="rejected").length,
paid:claims.filter(c=>c.status==="paid").length

};

const claimGraph = [

{name:"Pending",value:claimStats.pending},
{name:"Approved",value:claimStats.approved},
{name:"Rejected",value:claimStats.rejected},
{name:"Paid",value:claimStats.paid}

];


/* ================= FUEL DISTRIBUTION ================= */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fuelMap:any = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
cars.forEach((c:any)=>{
if(!c.fuel) return;
fuelMap[c.fuel] = (fuelMap[c.fuel] || 0) + 1;
});

const fuelGraph = Object.keys(fuelMap).map(f=>({
name:f,
value:fuelMap[f]
}));


/* ================= COLORS ================= */

const COLORS = ["#10b981","#06b6d4","#f59e0b","#ef4444"];


/* ================= LOADING ================= */

if(loading){

return(

<div className="min-h-screen flex items-center justify-center text-white bg-[#020617]">
Loading dashboard...
</div>

);

}


/* ================= UI ================= */

return(

<div className="min-h-screen bg-[#020617] text-white p-4 md:p-8">

<div className="max-w-7xl mx-auto space-y-8">


{/* HEADER */}

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

<h1 className="text-2xl md:text-3xl font-bold text-cyan-400">
Admin Dashboard
</h1>

<p className="text-slate-400 text-sm">
System analytics overview
</p>

</div>


{/* ================= STATS ================= */}

<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">

<Card title="Users" value={totalUsers} icon={<Users size={18}/>}/>
<Card title="Sellers" value={totalSellers} icon={<Users size={18}/>}/>
<Card title="Cars" value={totalCars} icon={<Car size={18}/>}/>
<Card title="Bookings" value={totalBookings} icon={<ClipboardList size={18}/>}/>
<Card title="Claims" value={totalClaims} icon={<AlertTriangle size={18}/>}/>
<Card title="Contacts" value={totalContacts} icon={<Mail size={18}/>}/>
<Card title="Revenue" value={`₹${revenue}`} icon={<IndianRupee size={18}/>}/>

</div>


{/* ================= GRAPHS ================= */}

<div className="grid lg:grid-cols-2 gap-6">

{/* BOOKING GRAPH */}

<GraphCard title="Monthly Bookings">

<ResponsiveContainer width="100%" height={260}>

<BarChart data={bookingGraph}>
<XAxis dataKey="month"/>
<YAxis/>
<Tooltip/>
<Bar dataKey="bookings" fill="#10b981"/>
</BarChart>

</ResponsiveContainer>

</GraphCard>


{/* REVENUE GRAPH */}

<GraphCard title="Monthly Revenue">

<ResponsiveContainer width="100%" height={260}>

<LineChart data={revenueGraph}>
<XAxis dataKey="month"/>
<YAxis/>
<Tooltip/>
<Line type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={3}/>
</LineChart>

</ResponsiveContainer>

</GraphCard>


{/* CLAIM GRAPH */}

<GraphCard title="Claim Status">

<ResponsiveContainer width="100%" height={260}>

<PieChart>

<Pie data={claimGraph} dataKey="value" nameKey="name" outerRadius={100}>

{claimGraph.map((_,i)=>(
<Cell key={i} fill={COLORS[i % COLORS.length]}/>
))}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</GraphCard>


{/* FUEL GRAPH */}

<GraphCard title="Fuel Distribution">

<ResponsiveContainer width="100%" height={260}>

<PieChart>

<Pie data={fuelGraph} dataKey="value" nameKey="name" outerRadius={100}>

{fuelGraph.map((_,i)=>(
<Cell key={i} fill={COLORS[i % COLORS.length]}/>
))}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</GraphCard>

</div>

</div>

</div>

);

}


/* ================= CARD ================= */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Card({title,value,icon}:{title:string,value:any,icon:any}){

return(

<div className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-xl flex items-center justify-between hover:bg-white/10 transition">

<div>

<p className="text-xs text-slate-400">
{title}
</p>

<p className="text-xl font-bold text-cyan-400">
{value}
</p>

</div>

<div className="text-cyan-300">
{icon}
</div>

</div>

);

}


/* ================= GRAPH CARD ================= */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function GraphCard({title,children}:{title:string,children:any}){

return(

<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">

<h3 className="mb-4 text-cyan-300 font-semibold">
{title}
</h3>

{children}

</div>

);

}