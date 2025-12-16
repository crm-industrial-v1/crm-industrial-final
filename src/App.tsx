import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { 
  LayoutDashboard, Users, UserPlus, Search, Trash2, Edit, 
  Phone, Briefcase, Save, Calendar, Factory, Package, Menu, 
  Loader2, CheckCircle2, X, Clock, ArrowRight, 
  ArrowLeft, Target, FileText
} from 'lucide-react';

// --- CONSTANTES ---
const MATERIAL_OPTIONS = [
  "00 - Fleje Manual", "00 - Fleje Automático", "00 - Fleje Poliéster (PET)", "00 - Fleje Acero",
  "01 - Film Estirable Manual", "01 - Film Estirable Automático", "01 - Film Macroperforado",
  "02 - Precinto PP", "02 - Precinto PVC", "02 - Precinto Personalizado",
  "03 - Film Retráctil", "05 - Protección", "06 - Bolsas", "99 - Otros"
];

const SECTORS = [
  "Agroalimentario", "Logística y Transporte", "Industria Metal", 
  "Construcción", "Químico / Farmacéutico", "E-commerce / Retail", "Otro"
];

// --- ESTILOS COMUNES ---
const inputClass = "w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm text-sm";
const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";
const selectClass = "w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm appearance-none text-sm";

// --- COMPONENTES UI ---
const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>{children}</div>
);

const SectionHeader = ({ title, icon: Icon, subtitle }: any) => (
  <div className="mt-6 md:mt-8 mb-4 md:mb-6 border-b border-slate-200 pb-3">
    <div className="flex items-center gap-3 text-slate-800">
      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
        {Icon && <Icon size={22} className="md:w-6 md:h-6" />}
      </div>
      <div>
        <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs md:text-sm text-slate-500 font-normal normal-case mt-0.5">{subtitle}</p>}
      </div>
    </div>
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", icon: Icon, type = "button", disabled = false }: any) => {
  const variants: any = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md disabled:bg-blue-300",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
  };
  return (
    <button 
      type={type} onClick={onClick} disabled={disabled}
      className={`px-4 md:px-5 py-2 md:py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm md:text-base ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={18} />} {children}
    </button>
  );
};

// --- APP PRINCIPAL ---
export default function App() {
  const [view, setView] = useState('dashboard');
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingContact, setEditingContact] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    fetchContacts();
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  async function fetchContacts() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('industrial_contacts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('¿Borrar registro permanentemente?')) return;
    const { error } = await supabase.from('industrial_contacts').delete().eq('id', id);
    if (!error) fetchContacts();
  }

  // --- VISTAS ---

  const DashboardView = () => {
    const total = contacts.length;
    const clients = contacts.filter(c => c.sap_status === 'Cliente SAP').length;
    const leads = contacts.filter(c => ['Lead SAP', 'Nuevo Prospecto'].includes(c.sap_status)).length;
    const today = new Date().toISOString().split('T')[0];
    const pending = contacts.filter(c => c.next_action_date && c.next_action_date <= today).length;

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">Panel de Control</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 md:p-5 border-l-4 border-l-blue-600 flex justify-between items-center hover:shadow-md transition-shadow">
             <div><p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Registros</p><h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">{total}</h3></div>
             <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Users size={24}/></div>
          </Card>
          <Card className="p-4 md:p-5 border-l-4 border-l-emerald-500 flex justify-between items-center hover:shadow-md transition-shadow">
             <div><p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Clientes SAP</p><h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">{clients}</h3></div>
             <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><CheckCircle2 size={24}/></div>
          </Card>
          <Card className="p-4 md:p-5 border-l-4 border-l-indigo-500 flex justify-between items-center hover:shadow-md transition-shadow">
             <div><p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Prospectos</p><h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">{leads}</h3></div>
             <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><Target size={24}/></div>
          </Card>
          <Card className={`p-4 md:p-5 border-l-4 flex justify-between items-center hover:shadow-md transition-shadow ${pending > 0 ? 'border-l-red-500 bg-red-50/30' : 'border-l-slate-300'}`}>
             <div><p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Acciones Hoy</p><h3 className={`text-2xl md:text-3xl font-bold mt-1 ${pending > 0 ? 'text-red-600' : 'text-slate-900'}`}>{pending}</h3></div>
             <div className="bg-white p-3 rounded-xl text-slate-400 border border-slate-100"><Clock size={24}/></div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4 md:p-6 h-full">
            <h3 className="font-bold text-lg mb-4 md:mb-6 flex items-center gap-2 text-slate-800">
              <Calendar className="text-blue-600"/> Agenda Prioritaria
            </h3>
            <div className="space-y-3">
               {contacts.filter(c => c.next_action_date).sort((a,b) => new Date(a.next_action_date).getTime() - new Date(b.next_action_date).getTime()).slice(0,5).map(c => (
                 <div key={c.id} className="flex items-center justify-between p-3 md:p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group" onClick={() => { setEditingContact(c); setView('form'); }}>
                   <div>
                     <span className="font-bold text-slate-800 text-sm group-hover:text-blue-700">{c.next_action}</span>
                     <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><FileText size={12}/> {c.fiscal_name}</p>
                   </div>
                   <div className="text-right">
                     <p className={`text-sm font-bold ${c.next_action_date <= today ? 'text-red-600' : 'text-blue-600'}`}>{c.next_action_date}</p>
                     <p className="text-xs text-slate-400 mt-0.5">{c.next_action_time?.slice(0,5)}</p>
                   </div>
                 </div>
               ))}
               {contacts.length === 0 && <div className="p-6 md:p-8 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">No hay acciones pendientes.</div>}
            </div>
          </Card>
          
          <Card className="p-6 flex flex-col justify-center items-center text-center bg-gradient-to-br from-white to-slate-50">
             <div className="bg-white p-4 md:p-6 rounded-full shadow-lg mb-4 md:mb-6">
                <UserPlus size={40} className="text-blue-600 md:w-12 md:h-12" />
             </div>
             <h3 className="font-bold text-lg md:text-xl text-slate-800 mb-2">Comenzar Nuevo Trabajo</h3>
             <p className="text-sm md:text-base text-slate-500 mb-6 md:mb-8 max-w-sm">Inicia un nuevo diagnóstico comercial, registra materiales y planifica el seguimiento.</p>
             <Button onClick={() => { setEditingContact(null); setView('form'); }} icon={UserPlus} className="px-6 md:px-8 py-3 md:py-4 text-lg shadow-xl shadow-blue-200">
               Nuevo Diagnóstico
             </Button>
          </Card>
        </div>
      </div>
    );
  };

  const ListView = () => {
    const filtered = contacts.filter(c => 
      c.fiscal_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-4 animate-in fade-in duration-500 pb-20">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
           <div>
             <h2 className="text-xl font-bold text-slate-800">Base de Datos</h2>
             <p className="text-sm text-slate-500">Gestión de fichas comerciales</p>
           </div>
           <div className="relative w-full md:w-80">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input type="text" placeholder="Buscar empresa o contacto..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
           </div>
        </div>

        {loading ? <div className="text-center p-20"><Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={32}/><p className="text-slate-500">Cargando datos...</p></div> : (
          <div className="grid gap-4">
            {filtered.map(c => (
              <Card key={c.id} className="p-4 md:p-5 hover:shadow-lg transition-all border hover:border-blue-300 group">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-700 transition-colors truncate">{c.fiscal_name}</h3>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border whitespace-nowrap ${c.sap_status === 'Cliente SAP' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{c.sap_status}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-4 text-sm text-slate-600">
                      <span className="flex items-center gap-2 truncate"><Users size={14} className="text-slate-400 shrink-0"/> {c.contact_person || 'Sin contacto'}</span>
                      <span className="flex items-center gap-2 truncate"><Factory size={14} className="text-slate-400 shrink-0"/> {c.sector || '-'}</span>
                      <span className="flex items-center gap-2 truncate"><Phone size={14} className="text-slate-400 shrink-0"/> {c.phone || '-'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 self-end md:self-center shrink-0">
                    <button onClick={() => { setEditingContact(c); setView('form'); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"><Edit size={18}/></button>
                    <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"><Trash2 size={18}/></button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const FormView = () => {
    const [activeTab, setActiveTab] = useState('sap');
    const [saving, setSaving] = useState(false);
    
    const TABS = [
        { id: 'sap', label: 'Identificación SAP', icon: Search },
        { id: 'registro', label: 'Datos de Registro', icon: Briefcase },
        { id: 'negocio', label: 'Contexto y Negocio', icon: Factory },
        { id: 'materiales', label: 'Materiales', icon: Package },
        { id: 'maquinaria', label: 'Maquinaria', icon: Factory },
        { id: 'necesidades', label: 'Necesidades', icon: Search },
        { id: 'cierre', label: 'Cierre', icon: Calendar }
    ];

    const generateInitialState = () => {
        let mats: any = {};
        for(let i=1; i<=7; i++) {
            mats[`mat${i}_type`] = ''; mats[`mat${i}_id`] = ''; mats[`mat${i}_consumption`] = '';
            mats[`mat${i}_supplier`] = ''; mats[`mat${i}_price`] = ''; mats[`mat${i}_notes`] = '';
            if(i > 1) mats[`hasMat${i}`] = false;
        }
        return {
            sap_status: 'Nuevo Prospecto', sap_id: '',
            fiscal_name: '', cif: '', contact_person: '', job_title: '', phone: '', email: '', address: '',
            sector: 'Agroalimentario', main_products: '', volume: 'Medio', packaging_mgmt: 'Mixto',
            ...mats,
            quality_rating: '3', sustainable_interest: 'No',
            mac1_type: '', mac1_brand: '', mac1_age: 'Media', mac1_status: 'Operativa',
            pain_points: [], budget: 'Sin presupuesto fijo',
            detected_interest: [], solution_summary: '', next_action: 'Llamada de seguimiento', next_action_date: '', next_action_time: '09:00', responsible: ''
        };
    };

    const [formData, setFormData] = useState(() => {
        if (editingContact) {
            const data = { ...editingContact };
            for(let i=2; i<=7; i++) {
                if(data[`mat${i}_type`] || data[`mat${i}_id`]) data[`hasMat${i}`] = true;
            }
            return data;
        }
        return generateInitialState();
    });

    const handleChange = (field: string, value: any) => setFormData({ ...formData, [field]: value });
    
    const handleMultiSelect = (field: string, value: string) => {
        const current = formData[field] || [];
        const updated = current.includes(value) ? current.filter((i: string) => i !== value) : [...current, value];
        setFormData({ ...formData, [field]: updated });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      const payload: any = { ...formData };
      
      // Limpieza de lógica interna
      for(let i=2; i<=7; i++) delete payload[`hasMat${i}`];
      delete payload.id; 
      delete payload.created_at;

      // --- SANITIZACIÓN (SOLUCIÓN ERROR FECHAS) ---
      if (!payload.next_action_date) payload.next_action_date = null;
      if (!payload.next_action_time) payload.next_action_time = null;
      // -------------------------------------------

      let error;
      try {
        if (editingContact) {
            const res = await supabase.from('industrial_contacts').update(payload).eq('id', editingContact.id);
            error = res.error;
        } else {
            const res = await supabase.from('industrial_contacts').insert([payload]);
            error = res.error;
        }

        if (!error) { 
            await fetchContacts(); 
            setView('list'); 
        } else { 
            throw error; 
        }
      } catch(err: any) {
        alert('Error al guardar: ' + err.message);
      } finally {
        setSaving(false);
      }
    };

    const goToNextTab = () => {
        const idx = TABS.findIndex(t => t.id === activeTab);
        if(idx < TABS.length -1) setActiveTab(TABS[idx+1].id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const goToPrevTab = () => {
        const idx = TABS.findIndex(t => t.id === activeTab);
        if(idx > 0) setActiveTab(TABS[idx-1].id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <div className="max-w-5xl mx-auto pb-32">
        <div className="flex flex-col md:flex-row justify-between mb-4 md:mb-6 sticky top-0 bg-slate-100/95 z-30 p-4 md:py-4 md:px-4 md:-mx-4 backdrop-blur-md border-b border-slate-200 md:border-b-0 md:rounded-b-xl">
           <div>
             <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
               {editingContact ? <Edit className="text-blue-600 w-6 h-6"/> : <UserPlus className="text-blue-600 w-6 h-6"/>}
               {editingContact ? 'Editar Diagnóstico' : 'Nuevo Diagnóstico'}
             </h2>
             <p className="text-sm text-slate-500 ml-8">Ficha técnica y comercial</p>
           </div>
           <div className="flex gap-3 mt-4 md:mt-0">
             <Button variant="secondary" onClick={() => setView('list')} className="flex-1 md:flex-none">Cancelar</Button>
             <Button variant="primary" onClick={handleSubmit} icon={Save} disabled={saving} className="flex-1 md:flex-none">{saving ? 'Guardando...' : 'Guardar'}</Button>
           </div>
        </div>

        {/* TABS HEADER */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-5 md:mb-8 p-1 md:p-2 flex overflow-x-auto no-scrollbar sticky top-[88px] md:top-24 z-20 mx-0 md:mx-1">
            {TABS.map(tab => (
                <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id)} 
                    className={`flex-1 min-w-[100px] md:min-w-[120px] flex flex-col items-center justify-center p-2 md:p-3 rounded-lg transition-all text-xs md:text-sm gap-1.5 md:gap-2 border ${
                        activeTab === tab.id 
                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-sm' 
                        : 'bg-white border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                >
                    <tab.icon size={20} className={`md:w-6 md:h-6 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`}/>
                    <span className="whitespace-normal text-center leading-tight">{tab.label}</span>
                </button>
            ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* 1. SAP */}
            {activeTab === 'sap' && (
                <Card className="p-4 md:p-8">
                    <SectionHeader title="Identificación SAP" icon={Search} subtitle="Clasificación del cliente en el sistema" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        <div>
                            <label className={labelClass}>Estado en SAP</label>
                            <select className={selectClass} value={formData.sap_status} onChange={e => handleChange('sap_status', e.target.value)}>
                                <option>Nuevo Prospecto</option><option>Lead SAP</option><option>Cliente SAP</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Código Interlocutor SAP</label>
                            <input className={inputClass} placeholder="Ej: C000450" value={formData.sap_id} onChange={e => handleChange('sap_id', e.target.value)} />
                        </div>
                    </div>
                    <div className="flex justify-end mt-8 md:mt-10 pt-6 border-t border-slate-100"><Button onClick={goToNextTab} icon={ArrowRight} variant="secondary" className="w-full md:w-auto">Siguiente</Button></div>
                </Card>
            )}

            {/* 2. REGISTRO */}
            {activeTab === 'registro' && (
                <Card className="p-4 md:p-8">
                    <SectionHeader title="Datos de Registro" icon={Briefcase} subtitle="Información fiscal y contacto principal" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        <div><label className={labelClass}>Nombre Fiscal *</label><input required className={inputClass} placeholder="Ej: Industrias S.L." value={formData.fiscal_name} onChange={e => handleChange('fiscal_name', e.target.value)} /></div>
                        <div><label className={labelClass}>CIF / NIF *</label><input required className={inputClass} placeholder="B-12345678" value={formData.cif} onChange={e => handleChange('cif', e.target.value)} /></div>
                        <div><label className={labelClass}>Persona Contacto</label><input className={inputClass} placeholder="Nombre y Apellido" value={formData.contact_person} onChange={e => handleChange('contact_person', e.target.value)} /></div>
                        <div><label className={labelClass}>Cargo</label><input className={inputClass} placeholder="Ej: Jefe de Compras" value={formData.job_title} onChange={e => handleChange('job_title', e.target.value)} /></div>
                        <div><label className={labelClass}>Teléfono</label><input className={inputClass} placeholder="+34 600..." value={formData.phone} onChange={e => handleChange('phone', e.target.value)} /></div>
                        <div><label className={labelClass}>Email</label><input type="email" className={inputClass} placeholder="correo@empresa.com" value={formData.email} onChange={e => handleChange('email', e.target.value)} /></div>
                        <div className="md:col-span-2"><label className={labelClass}>Dirección</label><input className={inputClass} placeholder="Calle Principal, 123" value={formData.address} onChange={e => handleChange('address', e.target.value)} /></div>
                    </div>
                    <div className="flex justify-between mt-8 md:mt-10 pt-6 border-t border-slate-100 gap-3"><Button onClick={goToPrevTab} icon={ArrowLeft} variant="ghost" className="flex-1 md:flex-none">Anterior</Button><Button onClick={goToNextTab} icon={ArrowRight} variant="secondary" className="flex-1 md:flex-none">Siguiente</Button></div>
                </Card>
            )}

            {/* 3. NEGOCIO */}
            {activeTab === 'negocio' && (
                <Card className="p-4 md:p-8">
                    <SectionHeader title="Contexto y Negocio" icon={Factory} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        <div><label className={labelClass}>Sector</label><select className={selectClass} value={formData.sector} onChange={e => handleChange('sector', e.target.value)}>{SECTORS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                        <div><label className={labelClass}>Volumen</label><select className={selectClass} value={formData.volume} onChange={e => handleChange('volume', e.target.value)}><option>Bajo</option><option>Medio</option><option>Alto</option></select></div>
                        <div><label className={labelClass}>Gestión Embalaje</label><select className={selectClass} value={formData.packaging_mgmt} onChange={e => handleChange('packaging_mgmt', e.target.value)}><option>Interno</option><option>Externalizado</option><option>Mixto</option></select></div>
                        <div><label className={labelClass}>Productos Principales</label><input className={inputClass} placeholder="¿Qué fabrican?" value={formData.main_products} onChange={e => handleChange('main_products', e.target.value)} /></div>
                    </div>
                    <div className="flex justify-between mt-8 md:mt-10 pt-6 border-t border-slate-100 gap-3"><Button onClick={goToPrevTab} icon={ArrowLeft} variant="ghost" className="flex-1 md:flex-none">Anterior</Button><Button onClick={goToNextTab} icon={ArrowRight} variant="secondary" className="flex-1 md:flex-none">Siguiente</Button></div>
                </Card>
            )}

            {/* 4. MATERIALES */}
            {activeTab === 'materiales' && (
                <Card className="p-4 md:p-8 bg-slate-50">
                    <SectionHeader title="Materiales de Consumo" icon={Package} subtitle="Registro técnico de materiales" />
                    {[1,2,3,4,5,6,7].map(num => {
                        const isVisible = num === 1 || formData[`hasMat${num}`];
                        if (!isVisible) return null;
                        return (
                            <div key={num} className={`rounded-xl border mb-6 md:mb-8 shadow-sm overflow-hidden ${num===1 ? 'bg-white border-blue-200 ring-1 ring-blue-100' : 'bg-white border-slate-200'}`}>
                                <div className="p-3 md:p-4 border-b bg-slate-50/50 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full text-white shadow-sm ${num===1?'bg-blue-600':'bg-slate-600'}`}>MAT {num}</span>
                                        <span className="text-sm font-bold text-slate-700">{num === 1 ? 'Material Principal' : 'Material Secundario'}</span>
                                    </div>
                                    {num > 1 && <button type="button" onClick={() => handleChange(`hasMat${num}`, false)} className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"><X size={20}/></button>}
                                </div>
                                <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="md:col-span-2"><label className={labelClass}>Tipo de Material</label><select className={selectClass} value={formData[`mat${num}_type`]} onChange={e => handleChange(`mat${num}_type`, e.target.value)}><option value="">Seleccionar Tipo...</option>{MATERIAL_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                                    <div><label className={labelClass}>ID / Medidas Exactas</label><input className={inputClass} placeholder="Ej: 500mm x 23mic" value={formData[`mat${num}_id`]} onChange={e => handleChange(`mat${num}_id`, e.target.value)} /></div>
                                    <div><label className={labelClass}>Consumo Anual</label><input className={inputClass} placeholder="Ej: 50 Palets" value={formData[`mat${num}_consumption`]} onChange={e => handleChange(`mat${num}_consumption`, e.target.value)} /></div>
                                    <div><label className={labelClass}>Proveedor Actual</label><input className={inputClass} value={formData[`mat${num}_supplier`]} onChange={e => handleChange(`mat${num}_supplier`, e.target.value)} /></div>
                                    <div><label className={labelClass}>Precio (€)</label><input className={inputClass} placeholder="0.00" value={formData[`mat${num}_price`]} onChange={e => handleChange(`mat${num}_price`, e.target.value)} /></div>
                                    <div className="md:col-span-2"><label className={labelClass}>Notas Técnicas</label><input className={inputClass} placeholder="Observaciones..." value={formData[`mat${num}_notes`]} onChange={e => handleChange(`mat${num}_notes`, e.target.value)} /></div>
                                </div>
                            </div>
                        );
                    })}
                    {[1,2,3,4,5,6].map(num => {
                        if ((num === 1 || formData[`hasMat${num}`]) && !formData[`hasMat${num+1}`]) {
                            return <button key={num} type="button" onClick={() => handleChange(`hasMat${num+1}`, true)} className="w-full py-4 border-2 border-dashed border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50/50 hover:border-blue-300 font-bold transition-all mb-4 flex items-center justify-center gap-2 text-sm md:text-base"><UserPlus size={20}/> Añadir Otro Material</button>
                        }
                        return null;
                    })}
                    <div className="flex justify-between mt-8 md:mt-10 pt-6 border-t border-slate-200 gap-3"><Button onClick={goToPrevTab} icon={ArrowLeft} variant="ghost" className="flex-1 md:flex-none">Anterior</Button><Button onClick={goToNextTab} icon={ArrowRight} variant="secondary" className="flex-1 md:flex-none">Siguiente</Button></div>
                </Card>
            )}

            {/* 5. MAQUINARIA */}
            {activeTab === 'maquinaria' && (
                <Card className="p-4 md:p-8">
                    <SectionHeader title="Maquinaria y Calidad" icon={Factory} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
                        <div className="p-4 md:p-6 bg-purple-50 rounded-xl border border-purple-100">
                            <label className="block text-sm font-bold text-purple-900 mb-4">Calidad Percibida (1-5)</label>
                            <div className="flex gap-2 md:gap-3 justify-between md:justify-start">{[1,2,3,4,5].map(v => (<button key={v} type="button" onClick={() => handleChange('quality_rating', v.toString())} className={`w-10 h-10 md:w-12 md:h-12 rounded-full font-bold text-base md:text-lg shadow-sm transition-all ${formData.quality_rating === v.toString() ? 'bg-purple-600 text-white scale-110 ring-4 ring-purple-200' : 'bg-white text-slate-600 border border-purple-200 hover:border-purple-400'}`}>{v}</button>))}</div>
                        </div>
                        <div className="p-4 md:p-6 bg-emerald-50 rounded-xl border border-emerald-100">
                            <label className="block text-sm font-bold text-emerald-900 mb-4">¿Interés Sostenible?</label>
                            <select className="w-full p-3 border border-emerald-200 rounded-lg bg-white text-emerald-900 font-medium focus:ring-2 focus:ring-emerald-500 outline-none text-sm" value={formData.sustainable_interest} onChange={e => handleChange('sustainable_interest', e.target.value)}><option>No</option><option>Sí</option></select>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm md:text-base"><Factory size={20} className="text-slate-400"/> Máquina Principal</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <div><label className={labelClass}>Tipo</label><input className={inputClass} placeholder="Ej: Enfardadora" value={formData.mac1_type} onChange={e => handleChange('mac1_type', e.target.value)} /></div>
                            <div><label className={labelClass}>Marca</label><input className={inputClass} placeholder="Marca" value={formData.mac1_brand} onChange={e => handleChange('mac1_brand', e.target.value)} /></div>
                            <div><label className={labelClass}>Antigüedad</label><select className={selectClass} value={formData.mac1_age} onChange={e => handleChange('mac1_age', e.target.value)}><option>Nueva</option><option>Media</option><option>Antigua</option></select></div>
                            <div><label className={labelClass}>Estado</label><select className={selectClass} value={formData.mac1_status} onChange={e => handleChange('mac1_status', e.target.value)}><option>Operativa</option><option>Averías</option><option>Para cambio</option></select></div>
                        </div>
                    </div>
                    <div className="flex justify-between mt-8 md:mt-10 pt-6 border-t border-slate-100 gap-3"><Button onClick={goToPrevTab} icon={ArrowLeft} variant="ghost" className="flex-1 md:flex-none">Anterior</Button><Button onClick={goToNextTab} icon={ArrowRight} variant="secondary" className="flex-1 md:flex-none">Siguiente</Button></div>
                </Card>
            )}

            {/* 6. NECESIDADES */}
            {activeTab === 'necesidades' && (
                <Card className="p-4 md:p-8 border-l-4 border-l-blue-600">
                    <SectionHeader title="Necesidades Detectadas" icon={Search} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-4">Puntos de Dolor</label>
                            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                {['Ahorro de costes', 'Renovación maquinaria', 'Mejorar estabilidad', 'Servicio Técnico', 'Reducir plástico'].map(opt => (
                                    <label key={opt} className="flex items-center gap-3 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                                        <input type="checkbox" checked={formData.pain_points?.includes(opt)} onChange={() => handleMultiSelect('pain_points', opt)} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-slate-300 shrink-0"/> 
                                        <span className="text-sm font-medium text-slate-700 leading-tight">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div><label className={labelClass}>Presupuesto</label><select className={selectClass} size={3} value={formData.budget} onChange={e => handleChange('budget', e.target.value)}><option className="p-2">Sin presupuesto fijo</option><option className="p-2">Partida anual cerrada</option><option className="p-2">Solo buscan precio bajo</option></select></div>
                    </div>
                    <div className="flex justify-between mt-8 md:mt-10 pt-6 border-t border-slate-100 gap-3"><Button onClick={goToPrevTab} icon={ArrowLeft} variant="ghost" className="flex-1 md:flex-none">Anterior</Button><Button onClick={goToNextTab} icon={ArrowRight} variant="secondary" className="flex-1 md:flex-none">Siguiente</Button></div>
                </Card>
            )}

            {/* 7. CIERRE */}
            {activeTab === 'cierre' && (
                <Card className="p-4 md:p-8 border-l-4 border-l-red-500 bg-red-50/10">
                    <SectionHeader title="Cierre y Compromiso" icon={Calendar} subtitle="Paso final obligatorio" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">Interés real en:</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {['Visita Técnica', 'Oferta Materiales', 'Propuesta Maquinaria', 'Mantenimiento'].map(opt => (
                                    <label key={opt} className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 shadow-sm cursor-pointer"><input type="checkbox" checked={formData.detected_interest?.includes(opt)} onChange={() => handleMultiSelect('detected_interest', opt)} className="text-red-600 rounded w-4 h-4 shrink-0"/> <span className="text-xs font-bold text-slate-700 leading-tight">{opt}</span></label>
                                ))}
                            </div>
                        </div>
                        <div><label className={labelClass}>Resumen Solución</label><textarea className={`${inputClass} h-32 resize-none`} placeholder="Escribe aquí el resumen de la visita..." value={formData.solution_summary} onChange={e => handleChange('solution_summary', e.target.value)} /></div>
                    </div>
                    <div className="bg-white p-4 md:p-6 rounded-xl border border-red-200 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            <div className="sm:col-span-2 md:col-span-1"><label className="block text-xs font-bold text-red-700 uppercase mb-2">PRÓXIMA ACCIÓN</label><select className="w-full p-3 border border-red-200 rounded-lg bg-red-50 text-red-900 font-bold focus:ring-2 focus:ring-red-500 outline-none text-sm" value={formData.next_action} onChange={e => handleChange('next_action', e.target.value)}><option>Llamada</option><option>Visita</option><option>Oferta</option><option>Cierre</option></select></div>
                            <div><label className="block text-xs font-bold text-red-700 uppercase mb-2">FECHA</label><input type="date" required className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" value={formData.next_action_date || ''} onChange={e => handleChange('next_action_date', e.target.value)} /></div>
                            <div><label className="block text-xs font-bold text-red-700 uppercase mb-2">HORA</label><input type="time" required className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" value={formData.next_action_time || ''} onChange={e => handleChange('next_action_time', e.target.value)} /></div>
                            <div className="sm:col-span-2 md:col-span-1"><label className="block text-xs font-bold text-red-700 uppercase mb-2">RESPONSABLE</label><input className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" value={formData.responsible} onChange={e => handleChange('responsible', e.target.value)} /></div>
                        </div>
                    </div>
                    <div className="flex flex-col-reverse md:flex-row justify-between mt-8 md:mt-10 pt-6 border-t border-red-100 gap-3">
                        <Button onClick={goToPrevTab} icon={ArrowLeft} variant="ghost" className="w-full md:w-auto">Anterior</Button>
                        <Button variant="primary" type="submit" icon={CheckCircle2} className="w-full md:w-auto px-6 md:px-10 py-3 md:py-4 text-base md:text-lg shadow-xl shadow-red-100 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-none">FINALIZAR Y GUARDAR</Button>
                    </div>
                </Card>
            )}
        </form>
      </div>
    );
  };

  const navBtnClass = (active: boolean) => `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`;

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
       <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col shadow-2xl shrink-0`}>
          <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
             <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg"><Factory size={20} className="text-white" /></div>
             <span className="text-xl font-bold tracking-tight">CRM V3</span>
          </div>
          <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
             <button onClick={() => { setView('dashboard'); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} className={navBtnClass(view === 'dashboard')}><LayoutDashboard size={20}/> <span>Dashboard</span></button>
             <button onClick={() => { setView('list'); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} className={navBtnClass(view === 'list')}><Users size={20}/> <span>Base de Datos</span></button>
             <div className="pt-6 pb-2 px-4"><p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Acciones Rápidas</p></div>
             <button onClick={() => { setEditingContact(null); setView('form'); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} className={navBtnClass(view === 'form')}><UserPlus size={20}/> <span>Nuevo Diagnóstico</span></button>
          </nav>
          <div className="p-4 bg-slate-950 text-xs text-slate-500 text-center border-t border-slate-800">v3.0.1 Stable</div>
       </aside>

       <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full bg-slate-50">
          <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between lg:hidden shadow-sm z-10 shrink-0">
             <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 p-2"><Menu size={24} /></button>
             <span className="font-bold text-slate-800">CRM Industrial</span><div className="w-8"></div>
          </header>
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 md:p-8 w-full scroll-smooth bg-slate-50">
            {view === 'dashboard' && <DashboardView />}
            {view === 'list' && <ListView />}
            {view === 'form' && <FormView />}
          </div>
       </main>
       {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>}
    </div>
  );
}