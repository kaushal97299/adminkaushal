"use client";

import { useEffect, useState } from "react";

export default function AdminClaims(){

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const [claims,setClaims] = useState<any[]>([]);
const [loading,setLoading] = useState(true);

const token =
typeof window !== "undefined"
? localStorage.getItem("admin_token")
: null;


/* ================= FETCH CLAIMS ================= */

const fetchClaims = async()=>{

try{

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/api/admin/claims`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

const data = await res.json();

setClaims(Array.isArray(data) ? data : []);

}catch(err){
console.log(err);
}

setLoading(false);

};

useEffect(()=>{
// eslint-disable-next-line react-hooks/set-state-in-effect
fetchClaims();
},[]);


/* ================= ACTIONS ================= */

const approve = async(id:string)=>{

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/api/admin/claims/approve/${id}`,
{
method:"PATCH",
headers:{ Authorization:`Bearer ${token}` }
}
);

const updated = await res.json();

setClaims(prev =>
prev.map(c => c._id === id ? updated : c)
);

};

const reject = async(id:string)=>{

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/api/admin/claims/reject/${id}`,
{
method:"PATCH",
headers:{ Authorization:`Bearer ${token}` }
}
);

const updated = await res.json();

setClaims(prev =>
prev.map(c => c._id === id ? updated : c)
);

};

const pay = async(id:string)=>{

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/api/admin/claims/pay/${id}`,
{
method:"PATCH",
headers:{ Authorization:`Bearer ${token}` }
}
);

const updated = await res.json();

setClaims(prev =>
prev.map(c => c._id === id ? updated : c)
);

};


/* ================= STATUS STYLE ================= */

const statusColor = (status:string)=>{

if(status==="pending") return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/20";
if(status==="approved") return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20";
if(status==="rejected") return "bg-red-500/20 text-red-300 border border-red-500/20";
if(status==="paid") return "bg-cyan-500/20 text-cyan-300 border border-cyan-500/20";

};


/* ================= LOADING ================= */

if(loading){

return(

<div className="min-h-screen flex items-center justify-center bg-[#020617] text-slate-400">

Loading claims...

</div>

);

}


/* ================= UI ================= */

return(

<div className="min-h-screen bg-[#020617] text-white p-8">

<div className="max-w-7xl mx-auto">


{/* HEADER */}

<div className="mb-10">

<h1 className="text-3xl font-bold text-cyan-400">
Claims Management
</h1>

<p className="text-slate-400 text-sm mt-1">
Review and manage vehicle damage claims
</p>

</div>


{/* TABLE CARD */}

<div className="bg-[#020b0a] border border-white/10 rounded-2xl shadow-lg overflow-hidden">


<table className="min-w-full text-sm">


{/* TABLE HEADER */}

<thead className="bg-[#020617] text-slate-400 uppercase text-xs tracking-wider border-b border-white/10">

<tr>

<th className="px-6 py-4 text-left">Car</th>
<th className="px-6 py-4 text-left">Customer</th>
<th className="px-6 py-4 text-left">Reason</th>
<th className="px-6 py-4 text-left">Amount</th>
<th className="px-6 py-4 text-left">Status</th>
<th className="px-6 py-4 text-center">Action</th>

</tr>

</thead>


{/* TABLE BODY */}

<tbody className="divide-y divide-white/5">

{claims.map(c=>(

<tr
key={c._id}
className="hover:bg-white/5 transition duration-200"
>

<td className="px-6 py-4 font-medium text-white">

<div className="flex items-center gap-2">

<span className="text-lg">🚗</span>

{c.carName}

</div>

</td>


<td className="px-6 py-4 text-slate-300">
{c.customerName}
</td>


<td className="px-6 py-4 text-slate-400">
{c.reason}
</td>


<td className="px-6 py-4 font-semibold text-emerald-400">
₹{c.amount}
</td>


<td className="px-6 py-4">

<span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor(c.status)}`}>
{c.status}
</span>

</td>


<td className="px-6 py-4">

<div className="flex justify-center gap-3">


{c.status==="pending" &&(

<button
onClick={()=>approve(c._id)}
className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black transition"
>
Approve
</button>

)}


{c.status==="pending" &&(

<button
onClick={()=>reject(c._id)}
className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-500 hover:bg-red-400 text-black transition"
>
Reject
</button>

)}


{c.status==="approved" &&(

<button
onClick={()=>pay(c._id)}
className="px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition"
>
Mark Paid
</button>

)}

</div>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</div>

);

}