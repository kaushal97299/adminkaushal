/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import {
Mail,
Send,
Trash2,
Eye,
MessageSquare,
Search
} from "lucide-react";

export default function AdminContactPage(){

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const [contacts,setContacts] = useState<any[]>([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const [filtered,setFiltered] = useState<any[]>([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const [selected,setSelected] = useState<any>(null);

const [reply,setReply] = useState("");

const [showReply,setShowReply] = useState(false);
const [showDetails,setShowDetails] = useState(false);

const [search,setSearch] = useState("");
const [statusFilter,setStatusFilter] = useState("all");
const [categoryFilter,setCategoryFilter] = useState("all");

const [page,setPage] = useState(1);
const perPage = 8;


/* LOAD CONTACTS */

const loadContacts = async ()=>{

try{

const token = localStorage.getItem("token");

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/api/admin/contact`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

const data = await res.json();

setContacts(data);
setFiltered(data);

}catch(err){
console.log(err);
}

};

useEffect(()=>{
loadContacts();
},[]);


/* FILTER */

useEffect(()=>{

let data = [...contacts];

if(search){
data = data.filter(c =>
c.name.toLowerCase().includes(search.toLowerCase()) ||
c.email.toLowerCase().includes(search.toLowerCase())
);
}

if(statusFilter !== "all"){
data = data.filter(c => c.status === statusFilter);
}

if(categoryFilter !== "all"){
data = data.filter(c => c.category === categoryFilter);
}

setFiltered(data);
setPage(1);

},[search,statusFilter,categoryFilter,contacts]);


/* DELETE */

const deleteContact = async(id:string)=>{

if(!confirm("Delete message?")) return;

const token = localStorage.getItem("token");

await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/api/admin/contact/${id}`,
{
method:"DELETE",
headers:{Authorization:`Bearer ${token}`}
}
);

loadContacts();

};


/* SEND REPLY */

const sendReply = async()=>{

if(!reply) return alert("Write reply");

const token = localStorage.getItem("token");

await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/api/admin/contact/reply/${selected._id}`,
{
method:"PUT",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({reply,status:"replied"})
}
);

setReply("");
setShowReply(false);
loadContacts();

};


/* UPDATE STATUS */

const updateStatus = async(id:string,status:string)=>{

const token = localStorage.getItem("token");

await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/api/admin/contact/reply/${id}`,
{
method:"PUT",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({status})
}
);

loadContacts();

};


/* PAGINATION */

const start = (page-1)*perPage;
const paginated = filtered.slice(start,start+perPage);
const totalPages = Math.ceil(filtered.length/perPage);


return(

<div className="min-h-screen bg-[#020617] p-8 text-white">

<div className="max-w-7xl mx-auto">

<h1 className="text-3xl font-bold mb-8 flex items-center gap-2">

<Mail className="text-cyan-400"/>

Contact Support Dashboard

<span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
{contacts.filter(c=>c.status==="new").length}
</span>

</h1>


{/* STATUS TABS */}

<div className="flex gap-2 mb-6">

{["all","new","in-progress","replied","closed"].map((s)=>(
<button
key={s}
onClick={()=>setStatusFilter(s)}
className={`px-4 py-2 rounded ${
statusFilter===s
?"bg-cyan-400 text-black"
:"bg-white/5 text-slate-300"
}`}
>
{s}
</button>
))}

</div>


{/* SEARCH + FILTER */}

<div className="flex flex-wrap gap-3 mb-6">

<div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3">

<Search size={16} className="text-slate-400"/>

<input
placeholder="Search name or email..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="p-2 outline-none bg-transparent text-white placeholder-slate-400"
/>

</div>


<select
value={categoryFilter}
onChange={(e)=>setCategoryFilter(e.target.value)}
className="p-2 rounded bg-white/5 border border-white/10 text-slate-300"
>
<option value="all">All Category</option>
<option value="booking">Booking</option>
<option value="payment">Payment</option>
<option value="availability">Availability</option>
<option value="complaint">Complaint</option>
<option value="other">Other</option>
</select>

</div>


{/* TABLE */}

<div className="border border-white/10 rounded-xl overflow-hidden">

<table className="w-full text-sm">

<thead className="bg-white/5">

<tr>

<th className="p-3 text-left">Name</th>
<th>Email</th>
<th>Category</th>
<th>Status</th>
<th>Date</th>
<th>Actions</th>

</tr>

</thead>

<tbody>

{paginated.map((c)=>(

<tr key={c._id} className="border-t border-white/10">

<td className="p-3">{c.name}</td>

<td className="text-slate-400">{c.email}</td>

<td>

<span className="bg-white/5 text-cyan-400 px-2 py-1 rounded text-xs">

{c.category}

</span>

</td>

<td>

<span className={`text-xs px-2 py-1 rounded ${
c.status==="new"
?"bg-yellow-500/10 text-yellow-400"
:c.status==="in-progress"
?"bg-blue-500/10 text-blue-400"
:c.status==="replied"
?"bg-green-500/10 text-green-400"
:"bg-red-500/10 text-red-400"
}`}>

{c.status}

</span>

</td>

<td className="text-xs text-slate-400">
{new Date(c.createdAt).toLocaleDateString()}
</td>


<td className="flex gap-2 py-3">

<button
onClick={()=>{setSelected(c);setShowDetails(true)}}
className="p-2 bg-white/5 rounded hover:bg-white/10"
>
<Eye size={16}/>
</button>

<button
onClick={()=>{setSelected(c);setShowReply(true)}}
className="p-2 bg-cyan-500/10 text-cyan-400 rounded hover:bg-cyan-500/20"
>
<MessageSquare size={16}/>
</button>

<button
onClick={()=>updateStatus(c._id,"in-progress")}
className="p-2 bg-blue-500/10 text-blue-400 rounded"
>
Start
</button>

<button
onClick={()=>deleteContact(c._id)}
className="p-2 bg-red-500/10 text-red-400 rounded"
>
<Trash2 size={16}/>
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>


{/* PAGINATION */}

<div className="flex justify-center gap-2 mt-6">

{Array.from({length:totalPages}).map((_,i)=>(

<button
key={i}
onClick={()=>setPage(i+1)}
className={`px-3 py-1 rounded ${
page===i+1
?"bg-cyan-400 text-black"
:"bg-white/5 text-slate-300"
}`}
>

{i+1}

</button>

))}

</div>


{/* DETAILS MODAL */}

{showDetails && selected && (

<div className="fixed inset-0 bg-black/60 flex items-center justify-center">

<div className="bg-[#020617] border border-white/10 p-6 rounded-xl w-[450px]">

<h2 className="text-xl font-semibold mb-4 text-cyan-400">
Message Details
</h2>

<p><b>Name:</b> {selected.name}</p>
<p><b>Email:</b> {selected.email}</p>
<p><b>Category:</b> {selected.category}</p>

<p className="mt-3 font-semibold">Message</p>

<p className="bg-white/5 p-3 rounded">
{selected.message}
</p>

{selected.attachment &&(

<a
href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/contact/${selected.attachment}`}
target="_blank"
className="text-cyan-400 text-sm mt-3 block"
>

View Attachment

</a>

)}

<button
onClick={()=>setShowDetails(false)}
className="mt-5 bg-cyan-400 text-black px-4 py-2 rounded"
>

Close

</button>

</div>

</div>

)}


{/* REPLY MODAL */}

{showReply && selected && (

<div className="fixed inset-0 bg-black/60 flex items-center justify-center">

<div className="bg-[#020617] border border-white/10 p-6 rounded-xl w-[450px]">

<h2 className="text-xl font-semibold mb-4 text-cyan-400">
Reply to {selected.name}
</h2>

<textarea
value={reply}
onChange={(e)=>setReply(e.target.value)}
className="w-full bg-white/5 border border-white/10 rounded p-2 h-28 text-white"
/>

<div className="flex gap-3 mt-4">

<button
onClick={sendReply}
className="bg-cyan-400 text-black px-4 py-2 rounded flex items-center gap-1"
>

<Send size={16}/> Send

</button>

<button
onClick={()=>setShowReply(false)}
className="bg-white/5 px-4 py-2 rounded text-slate-300"
>

Cancel

</button>

</div>

</div>

</div>

)}

</div>

</div>

);

}