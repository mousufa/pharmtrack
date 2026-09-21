import { useEffect, useMemo, useState } from 'react'
import { BookOpen, CalendarDays, Check, CheckCircle2, ChevronLeft, ChevronRight, ClipboardList, FileText, LayoutDashboard, MessageCircle, MoreHorizontal, Plus, Search, Settings2, Sparkles, Target, Timer, Upload } from 'lucide-react'
import './App.css'

function App() {
  const today = new Date()
  const dateKey = (date) => date.toISOString().slice(0, 10)
  const [activeView, setActiveView] = useState('Overview')
  const [selectedDate, setSelectedDate] = useState(dateKey(today))
  const [monthOffset, setMonthOffset] = useState(0)
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('pharmtrack-tasks') || 'null') || [
    { id: 1, title: 'Screen articles for literature review', tag: 'Research', done: true, date: dateKey(today) },
    { id: 2, title: 'Update methodology chapter', tag: 'Writing', done: false, date: dateKey(today) },
    { id: 3, title: 'Review patient counselling notes', tag: 'Practice', done: false, date: dateKey(today) },
    { id: 4, title: 'Email supervisor weekly update', tag: 'Admin', done: false, date: dateKey(today) },
  ])
  const [entries, setEntries] = useState(() => JSON.parse(localStorage.getItem('pharmtrack-entries') || 'null') || [
    { id: 1, date: dateKey(today), title: 'Literature screening', detail: 'Reviewed 4 articles on medication adherence in chronic care.', type: 'research' },
  ])
  const [literature, setLiterature] = useState(() => JSON.parse(localStorage.getItem('pharmtrack-literature') || 'null') || [
    { id: 1, title: 'Medication adherence interventions in community pharmacy', journal: 'Research in Social & Administrative Pharmacy · 2024', summary: 'A systematic review of practical interventions that improve adherence, with a focus on pharmacist-led counselling and follow-up.', tag: 'High relevance', file: 'adherence-review.pdf' },
    { id: 2, title: 'The role of the pharmacist in primary care', journal: 'International Journal of Clinical Pharmacy · 2023', summary: 'Explores how expanded clinical services can improve patient outcomes and strengthen continuity of care.', tag: 'To revisit', file: 'primary-care-pharmacist.pdf' },
  ])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [showLiteratureForm, setShowLiteratureForm] = useState(false)
  const [newTask, setNewTask] = useState('')
  const [newEntry, setNewEntry] = useState({ title: '', detail: '' })
  const [newLiterature, setNewLiterature] = useState({ title: '', summary: '', file: '' })

  useEffect(() => localStorage.setItem('pharmtrack-tasks', JSON.stringify(tasks)), [tasks])
  useEffect(() => localStorage.setItem('pharmtrack-entries', JSON.stringify(entries)), [entries])
  useEffect(() => localStorage.setItem('pharmtrack-literature', JSON.stringify(literature)), [literature])

  const dueDate = new Date('2027-12-31T23:59:59')
  const daysLeft = Math.max(0, Math.ceil((dueDate - today) / 86400000))
  const completed = tasks.filter((task) => task.done).length
  const progress = Math.round((completed / tasks.length) * 100)
  const monthDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const monthName = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const calendarDays = useMemo(() => {
    const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay()
    const count = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()
    return [...Array(firstDay).fill(null), ...Array.from({ length: count }, (_, index) => index + 1)]
  }, [monthOffset])
  const selectedItems = entries.filter((entry) => entry.date === selectedDate)
  const shareLiterature = (item) => window.open(`https://wa.me/?text=${encodeURIComponent(`${item.title}\n\n${item.summary}`)}`, '_blank')

  const addTask = (event) => {
    event.preventDefault()
    if (!newTask.trim()) return
    setTasks((current) => [...current, { id: Date.now(), title: newTask.trim(), tag: 'Project', done: false, date: selectedDate }])
    setNewTask(''); setShowTaskForm(false)
  }
  const addEntry = (event) => {
    event.preventDefault()
    if (!newEntry.title.trim()) return
    setEntries((current) => [...current, { id: Date.now(), date: selectedDate, ...newEntry, type: 'note' }])
    setNewEntry({ title: '', detail: '' }); setShowEntryForm(false)
  }
  const addLiterature = (event) => {
    event.preventDefault()
    if (!newLiterature.title.trim()) return
    setLiterature((current) => [{ id: Date.now(), journal: 'Personal library', tag: 'New reading', ...newLiterature }, ...current])
    setNewLiterature({ title: '', summary: '', file: '' }); setShowLiteratureForm(false)
  }

  const nav = [['Overview', LayoutDashboard], ['Calendar', CalendarDays], ['Daily log', ClipboardList], ['Literature', BookOpen]]

  return (
    <div className="app-shell">
      <aside className="sidebar"><div className="brand"><div className="brand-mark"><Sparkles size={17} /></div><span>pharm<span>track</span></span></div><div className="profile"><div className="avatar"><Sparkles size={15} /></div><div><strong>My workspace</strong><small>M.Pharm · Year 1</small></div><MoreHorizontal size={17} /></div><p className="nav-label">Workspace</p><nav>{nav.map(([label, Icon]) => <button key={label} className={activeView === label ? 'active' : ''} onClick={() => setActiveView(label)}><Icon size={18} />{label}<span>{label === 'Daily log' ? tasks.length : label === 'Literature' ? literature.length : ''}</span></button>)}</nav><div className="sidebar-bottom"><div className="course-mini"><div className="mini-row"><span>Course progress</span><strong>42%</strong></div><div className="progress"><i style={{ width: '42%' }} /></div><small>Ends December 2027</small></div><button className="settings"><Settings2 size={17} />Settings</button></div></aside>
      <main className="main-content"><header className="topbar"><div><p className="eyebrow">{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p><h1>{activeView === 'Overview' ? 'Good morning' : activeView}</h1></div><div className="top-actions"><button className="icon-button"><Search size={18} /></button><button className="button primary" onClick={() => setShowTaskForm(true)}><Plus size={17} /> Add task</button><div className="top-avatar"><Sparkles size={15} /></div></div></header>
        {activeView === 'Overview' && <><section className="hero-banner"><div><p className="eyebrow light">M.PHARM PRACTICE HUB</p><h2>Make steady progress<br />on the work that matters.</h2><p>One calm place for your research, practice hours, and daily momentum.</p></div><div className="hero-symbol"><Target size={78} strokeWidth={1.1} /></div></section><section className="stat-grid"><div className="stat-card"><div className="stat-icon coral"><Timer size={19} /></div><span>Course countdown</span><strong>{daysLeft}<small> days</small></strong><em>Until 31 Dec 2027</em></div><div className="stat-card"><div className="stat-icon teal"><CheckCircle2 size={19} /></div><span>Today's progress</span><strong>{completed}<small> / {tasks.length}</small></strong><em className="positive">{progress}% complete</em></div><div className="stat-card"><div className="stat-icon gold"><BookOpen size={19} /></div><span>Literature read</span><strong>{literature.length}<small> papers</small></strong><em>Across your library</em></div></section><div className="content-grid"><section className="panel daily-panel"><div className="panel-heading"><div><p className="eyebrow">TODAY'S FOCUS</p><h2>Daily checklist</h2></div><button className="text-button" onClick={() => setActiveView('Daily log')}>View all <ChevronRight size={15} /></button></div><div className="task-list">{tasks.slice(0, 4).map((task) => <label className={`task ${task.done ? 'done' : ''}`} key={task.id}><input type="checkbox" checked={task.done} onChange={() => setTasks(tasks.map((item) => item.id === task.id ? { ...item, done: !item.done } : item))} /><span className="check"><Check size={14} /></span><span className="task-title">{task.title}<small>{task.tag}</small></span><MoreHorizontal size={17} className="muted" /></label>)}</div>{showTaskForm && <form className="inline-form" onSubmit={addTask}><input autoFocus value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="What needs doing?" /><button className="button primary">Add</button></form>}<button className="add-line" onClick={() => setShowTaskForm(true)}><Plus size={16} /> Add a task</button></section><section className="panel week-panel"><div className="panel-heading"><div><p className="eyebrow">PROJECT LOG</p><h2>This week</h2></div><button className="icon-button small"><MoreHorizontal size={17} /></button></div><div className="week-list">{entries.slice(-3).map((entry) => <div className="week-item" key={entry.id}><div className={`week-dot ${entry.type}`} /><div><strong>{entry.title}</strong><p>{entry.detail}</p><small>{entry.date === dateKey(today) ? 'Today' : entry.date}</small></div></div>)}</div><button className="add-line" onClick={() => setShowEntryForm(true)}><Plus size={16} /> Log project activity</button>{showEntryForm && <form className="stack-form" onSubmit={addEntry}><input autoFocus value={newEntry.title} onChange={(event) => setNewEntry({ ...newEntry, title: event.target.value })} placeholder="Activity title" /><textarea value={newEntry.detail} onChange={(event) => setNewEntry({ ...newEntry, detail: event.target.value })} placeholder="What did you work on?" /><button className="button primary">Save to log</button></form>}</section></div><section className="panel literature-preview"><div className="panel-heading"><div><p className="eyebrow">READING DESK</p><h2>Recent literature</h2></div><button className="text-button" onClick={() => setActiveView('Literature')}>Open library <ChevronRight size={15} /></button></div><div className="literature-row">{literature.slice(0, 2).map((item) => <article className="literature-card" key={item.id}><div className="paper-icon"><FileText size={19} /></div><div><strong>{item.title}</strong><p>{item.journal}</p><span>{item.tag}</span></div><button className="share-button" title="Share summary on WhatsApp" onClick={() => shareLiterature(item)}><MessageCircle size={17} /></button></article>)}</div></section></>}
        {activeView === 'Calendar' && <section className="view-panel panel calendar-view"><div className="calendar-toolbar"><div><p className="eyebrow">YOUR RECORD</p><h2>{monthName}</h2></div><div className="month-controls"><button className="icon-button" onClick={() => setMonthOffset(monthOffset - 1)}><ChevronLeft size={17} /></button><button className="today-button" onClick={() => { setMonthOffset(0); setSelectedDate(dateKey(today)) }}>Today</button><button className="icon-button" onClick={() => setMonthOffset(monthOffset + 1)}><ChevronRight size={17} /></button></div></div><div className="calendar-grid weekdays">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{calendarDays.map((day, index) => { const key = day ? dateKey(new Date(monthDate.getFullYear(), monthDate.getMonth(), day)) : `empty-${index}`; const items = entries.filter((entry) => entry.date === key); return <button key={key} className={`calendar-day ${key === selectedDate ? 'selected' : ''} ${key === dateKey(today) ? 'today' : ''}`} onClick={() => day && setSelectedDate(key)}>{day && <><b>{day}</b>{items.map((item) => <small key={item.id}>{item.title}</small>)}{tasks.some((task) => task.done && task.date === key) && <i />}</>}</button> })}</div><div className="selected-day"><div><p className="eyebrow">SELECTED DAY</p><h3>{new Date(`${selectedDate}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3></div><button className="button secondary" onClick={() => setShowEntryForm(true)}><Plus size={16} /> Add note</button>{selectedItems.map((item) => <div className="selected-note" key={item.id}><FileText size={16} /><span><strong>{item.title}</strong><small>{item.detail}</small></span></div>)}</div>{showEntryForm && <form className="stack-form" onSubmit={addEntry}><input autoFocus value={newEntry.title} onChange={(event) => setNewEntry({ ...newEntry, title: event.target.value })} placeholder="Activity title" /><textarea value={newEntry.detail} onChange={(event) => setNewEntry({ ...newEntry, detail: event.target.value })} placeholder="What happened today?" /><button className="button primary">Save note</button></form>}</section>}
        {activeView === 'Daily log' && <section className="view-panel panel"><div className="panel-heading"><div><p className="eyebrow">DAILY LOG</p><h2>Everything you have done</h2></div><button className="button primary" onClick={() => setShowTaskForm(true)}><Plus size={17} /> Add task</button></div><div className="full-task-list">{tasks.map((task) => <label className={`task ${task.done ? 'done' : ''}`} key={task.id}><input type="checkbox" checked={task.done} onChange={() => { const updated = { ...task, done: !task.done }; setTasks(tasks.map((item) => item.id === task.id ? updated : item)); if (updated.done) setEntries([...entries, { id: Date.now(), date: dateKey(today), title: task.title, detail: 'Completed from daily checklist.', type: 'task' }]) }} /><span className="check"><Check size={14} /></span><span className="task-title">{task.title}<small>{task.tag} · {task.date}</small></span><MoreHorizontal size={17} className="muted" /></label>)}</div>{showTaskForm && <form className="inline-form" onSubmit={addTask}><input autoFocus value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="What needs doing?" /><button className="button primary">Add</button></form>}</section>}
        {activeView === 'Literature' && <section className="view-panel panel"><div className="panel-heading"><div><p className="eyebrow">READING DESK</p><h2>Literature library</h2></div><button className="button primary" onClick={() => setShowLiteratureForm(true)}><Upload size={16} /> Add literature</button></div><div className="library-list">{literature.map((item) => <article className="library-item" key={item.id}><div className="paper-icon large"><FileText size={22} /></div><div className="library-copy"><div className="library-title"><h3>{item.title}</h3><span>{item.tag}</span></div><p>{item.journal}</p><div className="summary"><strong>Summary</strong><span>{item.summary}</span></div><small className="filename">{item.file || 'No file attached'}</small></div><button className="share-button" onClick={() => shareLiterature(item)}><MessageCircle size={17} /> Share</button></article>)}</div>{showLiteratureForm && <form className="literature-form" onSubmit={addLiterature}><h3>Add a paper</h3><input autoFocus value={newLiterature.title} onChange={(event) => setNewLiterature({ ...newLiterature, title: event.target.value })} placeholder="Paper title" /><label className="file-picker"><Upload size={16} /><span>{newLiterature.file || 'Choose a PDF or document'}</span><input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setNewLiterature({ ...newLiterature, file: event.target.files[0]?.name || '' })} /></label><textarea value={newLiterature.summary} onChange={(event) => setNewLiterature({ ...newLiterature, summary: event.target.value })} placeholder="Your summary" /><div className="form-actions"><button type="button" className="button secondary" onClick={() => setShowLiteratureForm(false)}>Cancel</button><button className="button primary">Save paper</button></div></form>}</section>}
      </main>
    </div>
  )
}

export default App
