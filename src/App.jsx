import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Clapperboard, Film, Aperture, Clock, 
  Palette, Sun, Wand2, Copy, Play, 
  Settings, ChevronDown, Check, BookOpen, LayoutTemplate,
  Volume2, StopCircle, VolumeX, Sparkles
} from 'lucide-react';

const CinematicPromptGenerator = () => {
  // State untuk parameter (Subject dihapus dari UI, tapi ditangani di logic)
  const [params, setParams] = useState({
    sceneType: "Cinematic Film",
    mood: "Epic",
    visualStyle: "Hyper-Realistic",
    eraLook: "Modern",
    primaryMovement: "Push-In Dramatic",
    secondaryMovement: "Floating Camera",
    cameraAngle: "Eye Level",
    cameraDevice: "Cinema Camera",
    lensFocus: "Anamorphic Lens",
    motionStyle: "Real-Time",
    rhythm: "Slow-Burn",
    lighting: "Golden Hour",
    envEnhancement: "Dust Particles",
    colorGrading: "Teal & Orange",
    narrativeFocus: "A powerful emotional reveal"
  });

  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('glossary'); 
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [enableNarration, setEnableNarration] = useState(true); 
  const speechRef = useRef(null);

  // --- KAMUS DEFINISI ISTILAH ---
  const termDefinitions = {
    // Scene Types
    "Wedding": "Video pernikahan. Fokus pada keindahan momen sakral, emosi haru, dan detail estetika upacara.",
    "Action": "Genre aksi. Membutuhkan pergerakan cepat, potongan gambar dinamis, dan energi tinggi.",
    "Drama": "Genre drama. Fokus pada ekspresi wajah karakter dan kedalaman emosi cerita.",
    "Sci-Fi": "Fiksi ilmiah. Menonjolkan elemen futuristik, teknologi canggih, dan suasana dunia lain.",
    "Fantasy": "Fantasi. Dunia imajinatif dengan elemen sihir atau makhluk mitos.",
    
    // Moods
    "Epic": "Epik. Suasana megah dan kolosal, memberikan kesan agung pada subjek.",
    "Romantic": "Romantis. Suasana intim, hangat, dan penuh kasih sayang.",
    "Intense": "Intens. Suasana tegang dan penuh tekanan emosional.",
    "Sacred": "Sakral. Suasana hening, suci, dan penuh penghormatan.",
    "Dark": "Gelap. Nuansa misterius, suram, atau sedikit menyeramkan.",
    "Dreamy": "Seperti mimpi. Visual yang lembut, agak kabur, dan membuai.",

    // Camera Movements (Primary)
    "Dolly In": "Dolly In. Kamera bergerak maju mendekati subjek secara fisik. Menciptakan fokus dan keintiman emosional.",
    "Dolly Out": "Dolly Out. Kamera bergerak mundur menjauhi subjek. Memberikan kesan perpisahan, kesepian, atau memperlihatkan lingkungan.",
    "Orbit Shot": "Orbit Shot. Kamera berputar mengelilingi subjek. Menunjukkan subjek adalah pusat perhatian dari segala sisi.",
    "Truck Left-Right": "Trucking. Kamera bergerak menyamping (kiri atau kanan) mengikuti subjek yang berjalan.",
    "Push-In Dramatic": "Push In Dramatis. Gerakan maju perlahan untuk menekankan momen penting atau realisasi karakter.",
    "Handheld Cinematic": "Handheld. Kamera dipegang tangan, memberikan sedikit guncangan alami untuk kesan realisme atau ketegangan.",
    
    // --- TAMBAHAN DEFINISI (AGAR NARASI JALAN SEMUA) ---
    
    // Camera Devices
    "Cinema Camera": "Kamera Sinema. Kamera standar industri film layar lebar untuk kualitas gambar tertinggi dan rentang dinamis terbaik.",
    "Handheld Rig": "Handheld Rig. Kamera yang dioperasikan bahu atau tangan untuk kesan dokumenter atau aksi yang nyata.",
    "Gimbal": "Gimbal. Alat penstabil kamera elektronik. Menghasilkan gerakan yang sangat halus dan melayang.",
    "Drone": "Drone. Kamera terbang untuk pengambilan gambar udara (aerial) yang luas dan memberikan perspektif tinggi.",
    "FPV Drone": "FPV Drone. Drone balap yang bergerak sangat cepat dan akrobatik. Cocok untuk adegan kejar-kejaran yang intens.",
    "Shoulder Camera": "Shoulder Camera. Kamera panggul bergaya jurnalisme. Memberikan kesan 'berada di lokasi' kejadian.",
    "IMAX Camera": "Kamera IMAX. Kamera format besar dengan detail luar biasa, biasa digunakan untuk film blockbuster epik.",

    // Secondary Movements
    "None": "Tanpa gerakan tambahan. Kamera stabil pada gerakan utamanya.",
    "Parallax Motion": "Efek Parallax. Latar belakang bergerak dengan kecepatan berbeda dari latar depan, menciptakan efek 3D yang kuat.",
    "Floating Camera": "Kamera Melayang. Gerakan halus tanpa bobot, seolah-olah kamera melayang di udara. Memberikan kesan mimpi.",
    "Whip Pan": "Whip Pan. Gerakan menoleh (panning) yang sangat cepat hingga gambar menjadi buram. Bagus untuk transisi.",
    "Pedestal Up-Down": "Pedestal. Kamera bergerak naik atau turun secara vertikal tanpa mengubah sudut. Seperti lift.",
    "Crash Zoom": "Crash Zoom. Zoom in yang sangat cepat dan tiba-tiba ke wajah karakter. Memberikan efek kaget atau komedi.",
    "POV Camera": "POV. Point of View. Sudut pandang orang pertama, seolah penonton melihat melalui mata karakter.",
    "Subtle Shake": "Guncangan Halus. Sedikit getaran kamera untuk menambah realisme agar tidak terlihat terlalu statis atau buatan.",

    // Era / Look
    "Modern": "Era Modern. Tampilan bersih, tajam, resolusi tinggi dengan warna akurat khas produksi masa kini.",
    "Vintage Film": "Vintage Film. Tampilan film jadul dengan sedikit grain, warna pudar, dan ketidaksempurnaan yang estetik.",
    "90s Film": "Film 90an. Estetika film seluloid akhir abad 20, warna sedikit jenuh namun natural.",
    "Clean Digital": "Digital Bersih. Tampilan sangat tajam tanpa noise atau grain. Terlihat sangat futuristik dan higienis.",
    "80s VHS": "VHS 80an. Kualitas rendah yang disengaja, dengan garis tracking, warna meleber, dan kesan nostalgia.",
    "Classic Hollywood": "Hollywood Klasik. Pencahayaan glamor, fokus lembut, dan komposisi elegan ala film tahun 50an.",
    "Cyberpunk Future": "Cyberpunk. Estetika masa depan distopia dengan dominasi lampu neon, hujan, dan teknologi tinggi.",

    // Camera Angles
    "Eye Level": "Eye Level. Sejajar dengan mata. Sudut pandang netral, seperti kita melihat orang lain secara langsung.",
    "Low Angle": "Low Angle. Pengambilan gambar dari bawah. Membuat subjek terlihat lebih besar, kuat, dominan, atau heroik.",
    "High Angle": "High Angle. Pengambilan gambar dari atas. Membuat subjek terlihat lebih kecil, lemah, atau rentan.",
    "Dutch Angle": "Dutch Angle. Kamera dimiringkan. Menciptakan rasa ketidakstabilan, kebingungan, atau disorientasi.",
    "Top-Down": "Top Down. Kamera tegak lurus dari atas ke bawah. Bagus untuk memperlihatkan pola lantai atau posisi geografis.",
    "Over-The-Shoulder": "Over The Shoulder. Mengambil gambar dari belakang bahu satu karakter ke karakter lain. Standar untuk percakapan.",

    // Lenses
    "Anamorphic Lens": "Lensa Anamorphic. Menghasilkan format layar lebar, flare cahaya horizontal, dan bokeh lonjong khas film bioskop.",
    "35mm": "Lensa 35 mili. Lensa standar yang mirip dengan pandangan mata manusia, natural dan fleksibel.",
    "85mm": "Lensa 85 mili. Lensa potret yang memisahkan subjek dari latar belakang dengan efek blur yang indah.",
    
    // Lighting
    "Golden Hour": "Golden Hour. Cahaya matahari sesaat setelah terbit atau sebelum terbenam. Warnanya keemasan, lembut, dan sangat estetik.",
    "Natural Light": "Cahaya Alami. Mengandalkan matahari atau cahaya yang ada di lokasi tanpa lampu studio tambahan.",
    "High Contrast": "Kontras Tinggi. Perbedaan tajam antara area terang dan gelap. Menciptakan kesan dramatis atau misterius.",
    "Soft Diffused Light": "Cahaya Tersebar Lembut. Cahaya tanpa bayangan keras, membuat kulit terlihat halus dan suasana tenang.",
    "Backlight Rim": "Backlight. Cahaya dari belakang subjek, menciptakan garis cahaya di tepi siluet (rim light).",
    "Neon": "Lampu Neon. Pencahayaan warna-warni yang mencolok dan futuristik. Menciptakan suasana malam kota yang hidup.",
    "Moonlight": "Cahaya Bulan. Cahaya biru dingin yang redup untuk adegan malam hari yang misterius.",
    "Studio Lighting": "Lampu Studio. Pencahayaan buatan yang terkontrol sempurna, biasanya untuk iklan atau mode.",

    // Env Enhancement
    "Cinematic Fog": "Kabut Sinematik. Menambahkan atmosfer misterius dan membiaskan cahaya menjadi sinar yang terlihat (volumetric).",
    "Dust Particles": "Partikel Debu. Debu yang beterbangan di udara saat terkena cahaya. Menambah detail tekstur dan realisme.",
    "Rain": "Hujan. Menciptakan suasana melankolis atau dramatis. Permukaan basah juga memantulkan cahaya dengan indah.",
    "Floating Light Particles": "Partikel Cahaya. Titik-titik cahaya magis yang melayang, cocok untuk fantasi atau suasana mimpi.",
    "Smoke": "Asap. Lebih tebal dari kabut, biasanya untuk adegan perang, kebakaran, atau kekacauan.",
    "Snow": "Salju. Butiran salju turun untuk suasana dingin, sepi, atau romantis musim dingin.",
    "Lens Flares": "Lens Flare. Pantulan cahaya internal lensa yang muncul saat kamera menghadap sumber cahaya terang.",
    
    // Color Grading
    "Teal & Orange": "Teal and Orange. Skema warna Hollywood. Warna kulit oranye dikontraskan dengan latar belakang biru kehijauan.",
    "Warm Romantic": "Hangat Romantis. Dominasi warna kuning, merah, dan oranye untuk kesan nyaman dan penuh cinta.",
    "Black & White": "Hitam Putih. Klasik dan abadi, fokus pada komposisi dan pencahayaan tanpa gangguan warna.",
    "Muted Festival Tone": "Muted Tone. Warna-warna yang sedikit diredam atau tidak terlalu mencolok, memberikan kesan indie atau artistik.",
    "High Contrast Drama": "Drama Kontras Tinggi. Hitam yang pekat dan putih yang terang untuk dampak visual yang kuat.",
    "Bleach Bypass": "Bleach Bypass. Teknik yang mengurangi saturasi warna tapi meningkatkan kontras. Sering dipakai di film perang.",
    "Pastel": "Warna Pastel. Warna-warna lembut, cerah, dan manis. Cocok untuk video musik atau iklan ceria.",
    "Vibrant": "Vibrant. Warna-warna yang sangat cerah, hidup, dan bertenaga."
  };

  const options = {
    sceneType: ["Cinematic Film", "Wedding", "Action", "Drama", "Religious", "Invitation", "Documentary", "Fantasy", "Sci-Fi", "Commercial", "Music Video"],
    mood: ["Romantic", "Epic", "Intense", "Sacred", "Emotional", "Dark", "Dreamy", "Hopeful", "Melancholic", "Ethereal"],
    visualStyle: ["Cinematic Film", "Hyper-Realistic", "Dreamlike", "Festival Film", "Epic Scale", "Noir", "Avant-Garde", "Vintage Kodak"],
    eraLook: ["Modern", "Vintage Film", "90s Film", "Clean Digital", "80s VHS", "Classic Hollywood", "Cyberpunk Future"],
    primaryMovement: ["Dolly In", "Dolly Out", "Orbit Shot", "Truck Left-Right", "Steadicam Walkthrough", "Handheld Cinematic", "Aerial Drone", "Fly-Through", "Push-In Dramatic", "Pull-Back Reveal"],
    secondaryMovement: ["None", "Parallax Motion", "Floating Camera", "Whip Pan", "Pedestal Up-Down", "Crash Zoom", "POV Camera", "Subtle Shake"],
    cameraAngle: ["Eye Level", "Low Angle", "High Angle", "Top-Down", "Dutch Angle", "Over-The-Shoulder", "Worm's Eye View"],
    cameraDevice: ["Cinema Camera", "Handheld Rig", "Gimbal", "Drone", "FPV Drone", "Shoulder Camera", "IMAX Camera"],
    lensFocus: ["Anamorphic Lens", "35mm", "50mm", "85mm", "Wide Angle", "Telephoto", "Macro"],
    motionStyle: ["Real-Time", "Slow Motion", "Speed Ramp", "Freeze Frame Accent", "Reverse Motion Moment", "Timelapse"],
    rhythm: ["Slow-Burn", "Dynamic Cut", "Emotional Build-Up", "High Impact", "Flowing", "Staccato"],
    lighting: ["Natural Light", "Golden Hour", "Soft Diffused Light", "High Contrast", "Backlight Rim", "Neon", "Moonlight", "Studio Lighting"],
    envEnhancement: ["None", "Cinematic Fog", "Dust Particles", "Rain", "Floating Light Particles", "Smoke", "Snow", "Lens Flares"],
    colorGrading: ["Warm Romantic", "Teal & Orange", "Muted Festival Tone", "High Contrast Drama", "Black & White", "Bleach Bypass", "Pastel", "Vibrant"]
  };

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window && enableNarration) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID'; 
      utterance.rate = 1.05; 
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleParamChange = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
    if (termDefinitions[value] && enableNarration) {
      speak(termDefinitions[value]);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const generatePrompt = () => {
    setIsGenerating(true);
    stopSpeaking();
    
    setTimeout(() => {
      const {
        sceneType, mood, visualStyle, eraLook,
        primaryMovement, secondaryMovement, cameraAngle, cameraDevice, lensFocus,
        motionStyle, rhythm, lighting, envEnhancement, colorGrading, narrativeFocus
      } = params;

      // Otomatisasi Subjek berdasarkan Scene Type karena input manual dihapus
      const subjectText = `A cinematic ${sceneType.toLowerCase()} scene`;
      
      let prompt = `**Subject:** ${subjectText}\n\n`;
      prompt += `**Style:** ${mood} ${sceneType}, ${visualStyle}, ${eraLook} look. Narrative: ${narrativeFocus}.\n\n`;
      prompt += `**Camera:** ${cameraDevice}, ${lensFocus}, ${cameraAngle}.\n`;
      prompt += `**Movement:** ${primaryMovement} with ${secondaryMovement}.\n\n`;
      prompt += `**Atmosphere:** ${lighting}, ${envEnhancement}, ${colorGrading} grading.\n`;
      prompt += `**Specs:** ${motionStyle}, ${rhythm}, 8k resolution.`;

      const linearPrompt = `/imagine prompt: ${subjectText}. ${visualStyle}, ${mood} atmosphere, ${eraLook}. Camera Movement: ${primaryMovement} with ${secondaryMovement}. Angle: ${cameraAngle}. Shot on ${cameraDevice}, ${lensFocus}. Lighting: ${lighting}, ${envEnhancement}. Color Grading: ${colorGrading}. ${motionStyle}, ${rhythm}. ${narrativeFocus}. --ar 16:9 --v 6.0`;

      setGeneratedPrompt(linearPrompt);
      setIsGenerating(false);
    }, 600);
  };

  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = generatedPrompt;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopySuccess(true);
    } catch (err) {
      console.error('Gagal menyalin', err);
    }
    document.body.removeChild(textArea);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const generateExplanationScript = () => {
    const { mood, visualStyle, cameraDevice, lensFocus, lighting, primaryMovement, sceneType } = params;
    
    return `Prompt Anda sudah siap. 
    Ini adalah adegan "${sceneType}" dengan gaya "${visualStyle}" yang "${mood}".
    Kamera "${cameraDevice}" dan lensa "${lensFocus}" dipilih untuk tampilan profesional.
    Pencahayaan menggunakan teknik "${lighting}" untuk suasana terbaik.
    Gerakan kamera "${primaryMovement}" akan membuat video terasa dinamis.`;
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    stopSpeaking();

    if (tab === 'anatomy' && enableNarration) {
      let anatomyScript = generatedPrompt 
        ? generateExplanationScript() 
        : "Selamat datang. Klik tombol Generate di bawah untuk membuat prompt, dan saya akan jelaskan hasilnya.";
      setTimeout(() => speak(anatomyScript), 500); 
    }
  };

  const toggleNarration = () => {
    const newState = !enableNarration;
    setEnableNarration(newState);
    if (!newState) stopSpeaking();
  };

  // Komponen SelectField Minimalis
  const SelectField = ({ label, icon: Icon, value, options, onChange }) => (
    <div className="group relative">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <Icon size={12} className="text-indigo-400" /> {label}
        </label>
        {enableNarration && (
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-[9px] text-indigo-400 flex items-center gap-1 bg-indigo-950/50 px-1.5 py-0.5 rounded-full border border-indigo-900/50">
            <Volume2 size={8} /> Info
          </span>
        )}
      </div>
      <div className="relative">
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-900/50 hover:bg-slate-800/80 text-gray-200 text-sm border border-slate-700/50 rounded-lg py-2.5 pl-3 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 shadow-sm cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 pb-24 md:pb-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        
        {/* Minimalist Header */}
        <header className="flex items-center justify-between mb-8 border-b border-slate-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <Clapperboard size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                CinePrompt <span className="text-indigo-400 font-light">Director</span>
              </h1>
              <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest hidden md:block">AI Video Prompt Engineer</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleNarration}
              className={`p-2 rounded-full border transition-all duration-300 ${
                enableNarration 
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-500'
              }`}
              title={enableNarration ? "Matikan Suara" : "Hidupkan Suara"}
            >
              {enableNarration ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <div className="hidden md:flex items-center gap-1.5 text-[10px] font-medium bg-slate-900/80 py-1.5 px-3 rounded-full border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              ONLINE
            </div>
          </div>
        </header>

        {/* Indikator Suara Melayang */}
        {isSpeaking && (
          <div className="fixed top-24 right-4 z-50 flex items-center gap-2 animate-bounce-slow bg-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg shadow-indigo-900/50 border border-indigo-400/30 backdrop-blur-md">
            <Volume2 size={12} className="animate-pulse" /> Menjelaskan...
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* LEFT COLUMN: Controls (Parameters) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Group 1: Scene & Mood */}
            <div className="bg-slate-900/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-800/60 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 pb-2 border-b border-slate-800/50">
                <Film size={14} /> Adegan & Suasana
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <SelectField label="Jenis Adegan" icon={Film} value={params.sceneType} options={options.sceneType} onChange={(v) => handleParamChange('sceneType', v)} />
                <SelectField label="Mood" icon={Wand2} value={params.mood} options={options.mood} onChange={(v) => handleParamChange('mood', v)} />
                <SelectField label="Narasi" icon={Settings} value={params.narrativeFocus} options={["A powerful emotional reveal", "Sacred atmosphere", "Intimate romantic moment", "High-octane energy", "Mystery and suspense", "Peaceful solitude"]} onChange={(v) => handleParamChange('narrativeFocus', v)} />
              </div>
            </div>

            {/* Group 2: Camera & Visuals */}
            <div className="bg-slate-900/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-800/60 shadow-sm">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 pb-2 border-b border-slate-800/50">
                <Camera size={14} /> Kamera & Visual
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <SelectField label="Kamera" icon={Camera} value={params.cameraDevice} options={options.cameraDevice} onChange={(v) => handleParamChange('cameraDevice', v)} />
                <SelectField label="Lensa" icon={Aperture} value={params.lensFocus} options={options.lensFocus} onChange={(v) => handleParamChange('lensFocus', v)} />
                <SelectField label="Angle" icon={Aperture} value={params.cameraAngle} options={options.cameraAngle} onChange={(v) => handleParamChange('cameraAngle', v)} />
                <SelectField label="Gerakan Utama" icon={Camera} value={params.primaryMovement} options={options.primaryMovement} onChange={(v) => handleParamChange('primaryMovement', v)} />
                <SelectField label="Gerakan Sekunder" icon={Camera} value={params.secondaryMovement} options={options.secondaryMovement} onChange={(v) => handleParamChange('secondaryMovement', v)} />
                <SelectField label="Era / Look" icon={Clock} value={params.eraLook} options={options.eraLook} onChange={(v) => handleParamChange('eraLook', v)} />
              </div>
            </div>

            {/* Group 3: Lighting & Color */}
             <div className="bg-slate-900/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-800/60 shadow-sm">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 pb-2 border-b border-slate-800/50">
                <Palette size={14} /> Cahaya & Warna
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <SelectField label="Pencahayaan" icon={Sun} value={params.lighting} options={options.lighting} onChange={(v) => handleParamChange('lighting', v)} />
                <SelectField label="Grading Warna" icon={Palette} value={params.colorGrading} options={options.colorGrading} onChange={(v) => handleParamChange('colorGrading', v)} />
                <SelectField label="Efek Lingkungan" icon={Sparkles} value={params.envEnhancement} options={options.envEnhancement} onChange={(v) => handleParamChange('envEnhancement', v)} />
              </div>
            </div>
            
            {/* Mobile Spacer to avoid content being hidden by sticky button */}
            <div className="h-16 md:hidden"></div>
          </div>

          {/* RIGHT COLUMN: Output & Edukasi (Sticky on Desktop) */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-6 h-fit">
            
            {/* Output Card */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-hidden flex flex-col">
              <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <Play size={14} className="text-indigo-400" /> Hasil Prompt
                </h2>
                
                <div className="bg-black/40 rounded-xl p-4 min-h-[180px] border border-slate-800 relative group flex-1">
                  {generatedPrompt ? (
                    <p className="text-slate-300 text-xs leading-relaxed font-mono whitespace-pre-wrap">
                      {generatedPrompt}
                    </p>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-2 py-8">
                      <Clapperboard size={32} className="opacity-20" />
                      <span className="text-xs text-center px-4">Siap untuk dikonfigurasi</span>
                    </div>
                  )}
                  
                  {generatedPrompt && (
                    <button
                      onClick={copyToClipboard}
                      className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700 text-white p-1.5 rounded-lg border border-slate-600 transition-colors shadow-lg"
                      title="Salin Prompt"
                    >
                      {copySuccess ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-2">
                   {/* Tombol Generate - Sticky on Mobile Logic is below, this is for Desktop */}
                   <button
                    onClick={generatePrompt}
                    disabled={isGenerating}
                    className="hidden md:flex w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-900/30 transform transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center gap-2 text-sm"
                  >
                    {isGenerating ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Wand2 size={16} /> Buat Prompt
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-slate-500">
                    Support: Runway, Pika, Midjourney, Sora
                  </p>
                </div>
              </div>
            </div>

            {/* Edukasi Tab Minimalis */}
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 overflow-hidden">
               <div className="flex border-b border-slate-800/50">
                  <button
                    onClick={() => handleTabChange('glossary')}
                    className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'glossary' ? 'bg-indigo-500/10 text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <BookOpen size={12} /> Kamus
                  </button>
                  <button
                    onClick={() => handleTabChange('anatomy')}
                    className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'anatomy' ? 'bg-indigo-500/10 text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <LayoutTemplate size={12} /> Bedah
                  </button>
               </div>

               <div className="p-4 max-h-[250px] overflow-y-auto custom-scrollbar">
                  {/* Content logic remains mostly same, just styled */}
                  {activeTab === 'anatomy' && (
                     <div className="mb-3 flex justify-between items-center border-b border-slate-800 pb-2">
                       <span className="text-[10px] text-slate-400 uppercase">Status Suara</span>
                       {isSpeaking ? (
                        <button onClick={stopSpeaking} className="text-[10px] flex items-center gap-1 text-red-400 bg-red-900/20 px-2 py-1 rounded-md border border-red-900/30">
                          <StopCircle size={10} /> Stop
                        </button>
                      ) : (
                        <button onClick={() => handleTabChange('anatomy')} className="text-[10px] flex items-center gap-1 text-indigo-400 bg-indigo-900/20 px-2 py-1 rounded-md border border-indigo-900/30">
                          <Volume2 size={10} /> Putar
                        </button>
                      )}
                     </div>
                  )}
                  
                  {activeTab === 'glossary' ? (
                     <div className="space-y-3">
                        {/* Sample Glossary Items styled minimally */}
                        <div className="group">
                           <span className="text-xs font-bold text-indigo-300 block mb-0.5">Dolly In</span>
                           <span className="text-[11px] text-slate-400 leading-tight">Kamera bergerak maju mendekati subjek.</span>
                        </div>
                        <div className="group">
                           <span className="text-xs font-bold text-indigo-300 block mb-0.5">Anamorphic</span>
                           <span className="text-[11px] text-slate-400 leading-tight">Lensa layar lebar dengan efek flare khas bioskop.</span>
                        </div>
                        <div className="group">
                           <span className="text-xs font-bold text-indigo-300 block mb-0.5">Golden Hour</span>
                           <span className="text-[11px] text-slate-400 leading-tight">Cahaya matahari keemasan saat terbit/terbenam.</span>
                        </div>
                     </div>
                  ) : (
                     <div className="space-y-3">
                        <div className="group">
                           <span className="text-xs font-bold text-green-400 block mb-0.5">1. Subjek</span>
                           <span className="text-[11px] text-slate-400 leading-tight">Apa yang direkam. Fondasi utama prompt.</span>
                        </div>
                        <div className="group">
                           <span className="text-xs font-bold text-green-400 block mb-0.5">2. Gaya</span>
                           <span className="text-[11px] text-slate-400 leading-tight">Estetika visual (misal: Retro, Cyberpunk).</span>
                        </div>
                        <div className="group">
                           <span className="text-xs font-bold text-green-400 block mb-0.5">3. Kamera</span>
                           <span className="text-[11px] text-slate-400 leading-tight">Sudut pandang mata penonton.</span>
                        </div>
                     </div>
                  )}
               </div>
            </div>

          </div>

        </div>
      </div>

      {/* MOBILE STICKY GENERATE BUTTON */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 z-50">
        <button
          onClick={generatePrompt}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
        >
          {isGenerating ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              Memproses...
            </>
          ) : (
            <>
              <Wand2 size={18} /> Buat Prompt Sekarang
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default CinematicPromptGenerator;
