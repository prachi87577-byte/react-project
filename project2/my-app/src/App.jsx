import { useState } from "react";
 

function UserForm({ onAddUser }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", role: "", avatar: ""
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
 
  const avatarOptions = ["👨‍💻","👩‍💻","🧑‍🎨","👨‍🔬","👩‍🔬","🧑‍💼","👨‍🏫","👩‍🏫","🧑‍🚀","🦸"];
 
  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.role.trim()) e.role = "Role is required";
    return e;
  }
 
  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAddUser({
      ...form,
      id: Date.now(),
      avatar: form.avatar || avatarOptions[Math.floor(Math.random() * avatarOptions.length)],
      joinedAt: new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })
    });
    setForm({ name:"", email:"", phone:"", role:"", avatar:"" });
    setErrors({});
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  }
 
  return (
    <div className="formCard">
      <div className="formHeader">
        <div className="formTitle">➕ Add New User</div>
        <div className="formSub">Fill in the details to create a contact card</div>
      </div>

      {/* Avatar Picker */}
      <div className="avatarRow">
        {avatarOptions.map(a => (
          <button key={a} onClick={() => setForm({...form, avatar:a})}
            className={`avatarBtn ${form.avatar===a ? 'avatarBtnActive' : ''}`}>
            {a}
          </button>
        ))}
      </div>

      <div className="formGrid">
        {[
          { id:"name",  label:"Full Name",  placeholder:"xyz",         type:"text" },
          { id:"email", label:"Email",      placeholder:"xyz@example.com", type:"email" },
          { id:"phone", label:"Phone",      placeholder:"+91 98765 43210",  type:"tel" },
          { id:"role",  label:"Role / Title", placeholder:"Frontend Dev",  type:"text" },
        ].map(({id,label,placeholder,type}) => (
          <div key={id} className="field">
            <label className="label">{label}</label>
            <input
              type={type}
              placeholder={placeholder}
              value={form[id]}
              onChange={e => { setForm({...form,[id]:e.target.value}); setErrors({...errors,[id]:""}); }}
              className={`input ${errors[id] ? 'inputError' : ''}`}
            />
            {errors[id] && <span className="errText">{errors[id]}</span>}
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} className="submitBtn">
        ✨ Add Contact Card
      </button>
      {success && <div className="successMsg">🎉 User added successfully!</div>}
    </div>
  );
}
 

function UserCard({ user, onDelete }) {
  const [hovered, setHovered] = useState(false);
 
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`card ${hovered ? 'cardHovered' : ''}`}>
      <button onClick={() => onDelete(user.id)} className="delBtn">✕</button>
      <div className="cardAvatar">{user.avatar}</div>
      <div className="cardName">{user.name}</div>
      <div className="cardRole">{user.role}</div>
      <div className="cardDivider"/>
      <div className="cardInfo">
        <span className="cardInfoIcon">📧</span>
        <span className="cardInfoText">{user.email}</span>
      </div>
      <div className="cardInfo">
        <span className="cardInfoIcon">📞</span>
        <span className="cardInfoText">{user.phone}</span>
      </div>
      <div className="cardInfo cardInfoJoined">
        <span className="cardInfoIcon">📅</span>
        <span className="cardInfoText cardInfoTextJoined">Joined {user.joinedAt}</span>
      </div>
    </div>
  );
}
 

function UserList({ users, onDelete }) {
  if (users.length === 0) {
    return (
      <div className="emptyState">
        <div className="emptyIcon">👥</div>
        <div className="emptyTitle">No contacts yet</div>
        <div className="emptySub">Add your first user using the form above</div>
      </div>
    );
  }
  return (
    <div>
      <div className="listHeader">
        <span className="listTitle">Contact Directory</span>
        <span className="badge">{users.length} {users.length===1?"user":"users"}</span>
      </div>
      <div className="cardGrid">
        {users.map(u => <UserCard key={u.id} user={u} onDelete={onDelete}/>)}
      </div>
    </div>
  );
}
 
export default function App() {
  const [users, setUsers] = useState([
    { id:1, name:"Priya Sharma", email:"priya@example.com", phone:"+91 98100 11222", role:"UI Designer", avatar:"👩‍🎨", joinedAt:"01 Jan 2026" },
    { id:2, name:"Rahul Verma",  email:"rahul@example.com", phone:"+91 98200 33444", role:"Backend Dev",  avatar:"👨‍💻", joinedAt:"15 Feb 2026" },
  ]);
 
  function addUser(user)   { setUsers(prev => [user, ...prev]); }
  function deleteUser(id)  { setUsers(prev => prev.filter(u => u.id !== id)); }
 
  return (
    <div className="app">
      <div className="bgBlob1"/><div className="bgBlob2"/>
      <div className="wrap">
        {/* Header */}
        <div className="appHeader">
          <div className="appLogo">📇 ContactCards</div>
          <div className="appSub">React SPA · User Management</div>
        </div>
        <UserForm onAddUser={addUser}/>
        <UserList users={users} onDelete={deleteUser}/>
      </div>
    </div>
  );
}