# CinePrompt Director

CinePrompt Director adalah aplikasi web AI yang dirancang untuk menghasilkan prompt video sinematik profesional. Aplikasi ini memungkinkan pengguna untuk membuat prompt berkualitas tinggi untuk berbagai platform AI video generation seperti Runway, Pika, Midjourney, dan Sora.

## Fitur Utama

- 🎬 **Generator Prompt Sinematik** - Buat prompt video berkualitas profesional
- 🎨 **Kontrol Visual Lengkap** - Atur gaya visual, pencahayaan, dan warna
- 📹 **Parameter Kamera** - Pilih gerakan kamera, lensa, dan sudut pengambilan
- 🔊 **Narasi Suara Pintar** - Penjelasan otomatis untuk setiap parameter (bahasa Indonesia)
- 📚 **Kamus Istilah** - Definisi lengkap untuk semua parameter sinematik
- 💾 **Salin Prompt** - Mudah menyalin prompt ke clipboard
- 📱 **Responsive Design** - Bekerja sempurna di desktop dan mobile

## Teknologi

- **React 18** - UI library
- **Vite** - Build tool dan dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icon library
- **Web Speech API** - Text-to-speech narration

## Instalasi

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview
```

## Struktur Project

```
├── src/
│   ├── App.jsx              # Komponen utama aplikasi
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles dengan Tailwind
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Konfigurasi Vite
├── tailwind.config.js       # Konfigurasi Tailwind
└── postcss.config.js        # Konfigurasi PostCSS
```

## Penggunaan

1. **Atur Parameter** - Pilih scene type, mood, style visual, dan lainnya
2. **Generate Prompt** - Klik tombol "Buat Prompt" untuk generate
3. **Dengarkan Penjelasan** - Aktifkan narasi suara untuk penjelasan setiap parameter
4. **Salin Prompt** - Copy prompt yang sudah di-generate
5. **Gunakan di AI Video Tools** - Paste prompt ke Runway, Pika, Midjourney, atau Sora

## Parameter Tersedia

### Scene Types
Cinematic Film, Wedding, Action, Drama, Religious, Invitation, Documentary, Fantasy, Sci-Fi, Commercial, Music Video

### Moods
Romantic, Epic, Intense, Sacred, Emotional, Dark, Dreamy, Hopeful, Melancholic, Ethereal

### Camera Controls
- **Primary Movements**: Dolly In, Dolly Out, Orbit Shot, Push-In Dramatic, dll
- **Secondary Movements**: Parallax Motion, Floating Camera, Whip Pan, dll
- **Camera Angles**: Eye Level, Low Angle, High Angle, Dutch Angle, dll
- **Camera Devices**: Cinema Camera, Gimbal, Drone, FPV Drone, dll

### Lighting & Color
- **Pencahayaan**: Golden Hour, Natural Light, High Contrast, Neon, Moonlight, dll
- **Color Grading**: Teal & Orange, Warm Romantic, Black & White, Pastel, Vibrant, dll
- **Environment**: Cinematic Fog, Dust Particles, Rain, Floating Light Particles, dll

## Features Detail

### Text-to-Speech Narration
Setiap kali Anda memilih parameter, aplikasi akan membaca definisinya dalam bahasa Indonesia menggunakan Web Speech API.

### Glossary & Anatomy Tabs
- **Glossary**: Definisi istilah sinematik yang sering digunakan
- **Anatomy**: Penjelasan struktur prompt dan cara kerjanya

## Browser Support

Aplikasi ini bekerja optimal di:
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Lisensi

MIT License

## Kontribusi

Kontribusi sangat diterima! Silakan buat pull request untuk fitur atau perbaikan baru.
"# promptweb" 
"# promptweb" 
"# promptweb" 
"# promptweb" 
"# promptweb2" 
"# promptweb2" 
