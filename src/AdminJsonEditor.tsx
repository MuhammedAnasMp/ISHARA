import React, { useEffect, useState } from "react";
import {
    Save, Plus, Trash2, Upload, Copy, Check, ChevronDown,
    ChevronUp, Package, Image as ImageIcon, Info, Phone,
    AlertCircle, Loader2, Link, Globe, X
} from "lucide-react";

// --- Types ---
type MediaType = "image" | "video" | "gif";
interface MediaItem { url: string; type: MediaType; }

interface Product {
    id: string;
    name: string;
    price: string;
    description: string;
    category: string;
    details: string[]; // List of specific features/specs
    media: MediaItem[];
    orderButtonName: string; // New: Custom label (e.g., "Buy on Instagram")
    orderURL: string;        // New: The actual link
}

interface SiteData {
    brandName: string;
    hero: { tagline: string; title: string; accentTitle: string; subtitle: string; backgroundImage: MediaItem; };
    about: { subtitle: string; title: string; content: string; image: MediaItem; };
    contact: { address: string; phone: string; email: string; instagram: string; instagramDm: string; };
    products: Product[];
}

// --- Constants ---
const CLOUDINARY_JSON_URL = import.meta.env.VITE_CLOUDINARY_JSON_URL;
const CLOUDINARY_UPLOAD_PRESET = "ishra jwellers";
const CLOUD_NAME = "dyt8amitd";

const DEFAULT_SITE_DATA: SiteData = {
    brandName: "",
    hero: { tagline: "", title: "", accentTitle: "", subtitle: "", backgroundImage: { url: "", type: "image" } },
    about: { subtitle: "", title: "", content: "", image: { url: "", type: "image" } },
    contact: { address: "", phone: "", email: "", instagram: "", instagramDm: "" },
    products: [],
};

const AdminJsonEditor: React.FC = () => {
    const [data, setData] = useState<SiteData>(DEFAULT_SITE_DATA);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [open, setOpen] = useState<string | null>("brand");
    const [jsonUrl, setJsonUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchJson = async () => {
            try {
                const res = await fetch(CLOUDINARY_JSON_URL);
                if (!res.ok) throw new Error("Could not connect to the database.");
                const jsonData = await res.json();
                setData(jsonData);
            } catch (err: any) {
                setStatusMsg({ type: 'error', text: "Error loading data: " + err.message });
            } finally {
                setIsLoading(false);
            }
        };
        fetchJson();
    }, []);

    const handleCopy = async () => {
        if (jsonUrl) {
            await navigator.clipboard.writeText(jsonUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, { method: "POST", body: formData });
        if (!res.ok) throw new Error("Media upload failed");
        const json = await res.json();
        return {
            url: json.secure_url,
            type: file.type.includes("video") ? "video" : file.type.includes("gif") ? "gif" : "image"
        } as MediaItem;
    };

    const handleMediaUpload = async (files: FileList | null, callback: (media: MediaItem[]) => void) => {
        if (!files) return;
        setIsSaving(true);
        try {
            const uploaded: MediaItem[] = [];
            for (let i = 0; i < files.length; i++) {
                uploaded.push(await uploadFile(files[i]));
            }
            callback(uploaded);
        } catch (err: any) {
            setStatusMsg({ type: 'error', text: err.message });
        } finally {
            setIsSaving(false);
        }
    };

    const saveJsonToCloudinary = async () => {
        setIsSaving(true);
        setStatusMsg(null);
        try {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const formData = new FormData();
            formData.append("file", blob);
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`, { method: "POST", body: formData });
            if (!res.ok) throw new Error("Cloudinary save failed.");
            const json = await res.json();
            setJsonUrl(json.secure_url);
            setStatusMsg({ type: 'success', text: "Dashboard configuration published successfully!" });
        } catch (err: any) {
            setStatusMsg({ type: 'error', text: err.message });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-indigo-600">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-medium animate-pulse">Initializing ISHARA ...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fcfcfd] text-slate-900 pb-24 font-sans">
            {/* STICKY HEADER */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-2 rounded-lg text-white"><Globe className="w-5 h-5" /></div>
                        <h1 className="text-xl font-black uppercase tracking-widest text-slate-800">Ishara <span className="text-indigo-600"></span></h1>
                    </div>
                    {jsonUrl && (
                        <div className="bg-white border-2 border-emerald-100 p-6 rounded-3xl shadow-xl shadow-emerald-50 flex flex-col md:flex-row items-center gap-6 animate-in zoom-in-95">
                            <div className="bg-emerald-500 p-3 rounded-2xl text-white shadow-lg shadow-emerald-200">
                                <Check className="w-6 h-6" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <p className="text-emerald-900 font-bold">Successfully Published!</p>
                                <p className="text-slate-500 text-xs truncate max-w-[250px] md:max-w-md">{jsonUrl}</p>
                            </div>
                            <button
                                onClick={handleCopy}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? "Copied!" : "Copy URL"}
                            </button>
                        </div>
                    )}
                    <button
                        onClick={saveJsonToCloudinary}
                        disabled={isSaving}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-8 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Publish Changes
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6 space-y-8 mt-4">
                {/* STATUS FEEDBACK */}
                {statusMsg && (
                    <div className={`p-4 rounded-2xl flex items-center gap-3 border animate-in fade-in slide-in-from-top-4 ${statusMsg.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                        {statusMsg.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                        <p className="text-sm font-medium">{statusMsg.text}</p>
                    </div>
                )}

                <div className="grid gap-6">
                    {/* BRANDING SECTION */}
                    <AdminSection title="General Branding" id="brand" active={open} onToggle={setOpen} icon={<Link />}>
                        <div className="p-6">
                            <label className="block text-xs font-bold uppercase text-slate-400 mb-2 tracking-tighter">Brand Name</label>
                            <input
                                type="text"
                                className="w-full border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl p-3 outline-none transition-all"
                                value={data.brandName}
                                onChange={(e) => setData({ ...data, brandName: e.target.value })}
                            />
                        </div>
                    </AdminSection>

                    {/* HERO SECTION */}
                    <AdminSection title="Hero Section" id="hero" active={open} onToggle={setOpen} icon={<ImageIcon />}>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {["tagline", "title", "accentTitle", "subtitle"].map((field) => (
                                    <div key={field}>
                                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">{field}</label>
                                        <input
                                            type="text"
                                            className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                            value={(data.hero as any)[field]}
                                            onChange={(e) => setData({ ...data, hero: { ...data.hero, [field]: e.target.value } })}
                                        />
                                    </div>
                                ))}
                            </div>
                            <MediaUploader
                                label="Hero Background Image"
                                currentUrl={data.hero.backgroundImage.url}
                                onUpload={(file) => handleMediaUpload(file, ([up]) => setData({ ...data, hero: { ...data.hero, backgroundImage: up } }))}
                            />
                        </div>
                    </AdminSection>

                    {/* ABOUT SECTION */}
                    <AdminSection title="About Section" id="about" active={open} onToggle={setOpen} icon={<Info />}>
                        <div className="p-6 space-y-4">
                            {["subtitle", "title"].map((field) => (
                                <input key={field} placeholder={field} className="w-full border border-slate-200 p-3 rounded-xl" value={(data.about as any)[field]} onChange={(e) => setData({ ...data, about: { ...data.about, [field]: e.target.value } })} />
                            ))}
                            <textarea
                                placeholder="Content Description"
                                className="w-full border border-slate-200 p-3 rounded-xl h-32"
                                value={data.about.content}
                                onChange={(e) => setData({ ...data, about: { ...data.about, content: e.target.value } })}
                            />
                            <MediaUploader label="About Photo" currentUrl={data.about.image.url} onUpload={(file) => handleMediaUpload(file, ([up]) => setData({ ...data, about: { ...data.about, image: up } }))} />
                        </div>
                    </AdminSection>

                    {/* CONTACT SECTION */}
                    <AdminSection title="Contact Information" id="contact" active={open} onToggle={setOpen} icon={<Phone />}>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.keys(data.contact).map((key) => (
                                <div key={key}>
                                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">{key}</label>
                                    <input
                                        className="w-full border border-slate-200 p-3 rounded-xl"
                                        value={(data.contact as any)[key]}
                                        onChange={(e) => setData({ ...data, contact: { ...data.contact, [key]: e.target.value } })}
                                    />
                                </div>
                            ))}
                        </div>
                    </AdminSection>

                    {/* PRODUCTS SECTION */}
                    <AdminSection title={`Products (${data.products.length})`} id="products" active={open} onToggle={setOpen} icon={<Package />}>
                        <div className="p-6 space-y-6">
                            <button
                                onClick={() => setData({ ...data, products: [...data.products, { id: `prod_${Date.now()}`, name: "", price: "", description: "", category: "", details: [], media: [], orderButtonName: "Order Now", orderURL: "" }] })}
                                className="w-full border-2 border-dashed border-indigo-200 py-4 rounded-2xl text-indigo-600 font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" /> Add New Product
                            </button>

                            <div className="space-y-4">
                                {data.products.map((prod, idx) => (
                                    <div key={prod.id} className="border border-slate-100 bg-slate-50/50 p-6 rounded-3xl relative group">
                                        <button
                                            onClick={() => setData({ ...data, products: data.products.filter((_, i) => i !== idx) })}
                                            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>

                                        {/* Core Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                            <input placeholder="Name" className="p-2.5 rounded-lg border border-slate-200" value={prod.name} onChange={(e) => { const p = [...data.products]; p[idx].name = e.target.value; setData({ ...data, products: p }); }} />
                                            <input placeholder="Price" className="p-2.5 rounded-lg border border-slate-200" value={prod.price} onChange={(e) => { const p = [...data.products]; p[idx].price = e.target.value; setData({ ...data, products: p }); }} />
                                            <input placeholder="Category" className="p-2.5 rounded-lg border border-slate-200" value={prod.category} onChange={(e) => { const p = [...data.products]; p[idx].category = e.target.value; setData({ ...data, products: p }); }} />
                                        </div>

                                        <textarea placeholder="Description" className="w-full p-2.5 rounded-lg border border-slate-200 mb-4" value={prod.description} onChange={(e) => { const p = [...data.products]; p[idx].description = e.target.value; setData({ ...data, products: p }); }} />

                                        {/* Details Logic */}
                                        <div className="mb-4">
                                            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">Product Details / Specs</label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {prod.details.map((detail, dIdx) => (
                                                    <span key={dIdx} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
                                                        {detail}
                                                        <X
                                                            className="w-3 h-3 cursor-pointer hover:text-red-500"
                                                            onClick={() => {
                                                                const p = [...data.products];
                                                                p[idx].details = p[idx].details.filter((_, i) => i !== dIdx);
                                                                setData({ ...data, products: p });
                                                            }}
                                                        />
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    id={`new-detail-${idx}`}
                                                    placeholder="e.g. 24k Gold Plated"
                                                    className="flex-1 p-2 text-xs rounded-lg border border-slate-200"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            const val = (e.target as HTMLInputElement).value;
                                                            if (!val) return;
                                                            const p = [...data.products];
                                                            p[idx].details.push(val);
                                                            setData({ ...data, products: p });
                                                            (e.target as HTMLInputElement).value = "";
                                                        }
                                                    }}
                                                />
                                                <button
                                                    className="bg-slate-200 hover:bg-slate-300 p-2 rounded-lg text-xs font-bold"
                                                    onClick={() => {
                                                        const el = document.getElementById(`new-detail-${idx}`) as HTMLInputElement;
                                                        if (!el.value) return;
                                                        const p = [...data.products];
                                                        p[idx].details.push(el.value);
                                                        setData({ ...data, products: p });
                                                        el.value = "";
                                                    }}
                                                >
                                                    Add Detail
                                                </button>
                                            </div>
                                        </div>

                                        {/* Order Logic */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Button Label</label>
                                                <input placeholder="e.g. Buy on WhatsApp" className="w-full p-2.5 rounded-lg border border-slate-200 text-xs" value={prod.orderButtonName} onChange={(e) => { const p = [...data.products]; p[idx].orderButtonName = e.target.value; setData({ ...data, products: p }); }} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Order URL</label>
                                                <input placeholder="https://..." className="w-full p-2.5 rounded-lg border border-slate-200 text-xs" value={prod.orderURL} onChange={(e) => { const p = [...data.products]; p[idx].orderURL = e.target.value; setData({ ...data, products: p }); }} />
                                            </div>
                                        </div>

                                        {/* Media */}
                                        <div className="flex flex-wrap gap-2">
                                            {prod.media.map((m, i) => (
                                                <div key={i} className="group relative w-20 h-20 rounded-lg overflow-hidden border bg-white shadow-sm">
                                                    <button
                                                        onClick={() => {
                                                            const p = [...data.products];
                                                            p[idx].media = p[idx].media.filter((_, mi) => mi !== i);
                                                            setData({ ...data, products: p });
                                                        }}
                                                        className="absolute top-1 right-1 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3 text-red-500" />
                                                    </button>
                                                    {m.type === 'video' ? <div className="w-full h-full flex items-center justify-center bg-black text-[10px] text-white">Video</div> : <img src={m.url} className="w-full h-full object-cover" />}
                                                </div>
                                            ))}
                                            <label className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                                                <Upload className="w-5 h-5 text-slate-300" />
                                                <input type="file" multiple className="hidden" onChange={(e) => handleMediaUpload(e.target.files, (up) => { const p = [...data.products]; p[idx].media.push(...up); setData({ ...data, products: p }); })} />
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AdminSection>
                </div>

                {/* COPY PUBLISHED URL */}

            </main>
        </div>
    );
};

// --- Sub-Components ---
const AdminSection = ({ title, id, active, onToggle, icon, children }: any) => {
    const isOpen = active === id;
    return (
        <div className={`bg-white border border-slate-200 rounded-3xl overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-2xl shadow-slate-200/50 ring-1 ring-indigo-500/10' : 'shadow-sm'}`}>
            <button onClick={() => onToggle(isOpen ? null : id)} className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl transition-colors ${isOpen ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{icon}</div>
                    <span className={`font-bold tracking-tight ${isOpen ? 'text-slate-900' : 'text-slate-600'}`}>{title}</span>
                </div>
                {isOpen ? <ChevronUp className="text-indigo-600" /> : <ChevronDown className="text-slate-300" />}
            </button>
            {isOpen && <div className="border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">{children}</div>}
        </div>
    );
};

const MediaUploader = ({ label, currentUrl, onUpload }: { label: string, currentUrl: string, onUpload: (files: FileList | null) => void }) => (
    <div className="space-y-2">
        <label className="block text-[10px] font-bold uppercase text-slate-400">{label}</label>
        <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
            {currentUrl && <img src={currentUrl} className="w-16 h-16 rounded-xl object-cover border border-slate-100" />}
            <div className="flex-1">
                <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-2">
                    <Upload className="w-3 h-3" /> Select File
                    <input type="file" className="hidden" onChange={(e) => onUpload(e.target.files)} />
                </label>
            </div>
        </div>
    </div>
);

export default AdminJsonEditor;