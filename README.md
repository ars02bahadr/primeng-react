# 🚀 PrimeReact Next.js Projesi 

Modern ve kullanıcı dostu bir web uygulaması geliştirmek için Next.js 14, PrimeReact ve Redux tabanlı başlangıç şablonu.

## ✨ Özellikler

- ⚡ Next.js 14 App Router
- 🎨 PrimeReact UI Bileşenleri
- 📦 Redux Toolkit State Yönetimi
- 🔐 JWT Tabanlı Kimlik Doğrulama
- 🌐 Axios HTTP İstemcisi
- 📱 Modern ve Responsive Tasarım
- 🖥️ Server Side Rendering (SSR)

## 📊 Redux ve State Yönetimi

### 🤔 Redux Nedir ve Neden Kullanılır?
Redux, React uygulamaları için merkezi bir state (durum) yönetim kütüphanesidir. Özellikle:

1. **🎯 Merkezi State Yönetimi**: 
   - 📍 Tüm uygulama verilerini tek bir yerde toplar
   - 🔄 Komponentler arası veri paylaşımını kolaylaştırır
   - 📈 State değişikliklerini tahmin edilebilir hale getirir

2. **⚡ Performans Optimizasyonu**:
   - 🚫 Gereksiz render'ları önler
   - 📈 Büyük uygulamalarda state yönetimini optimize eder

3. **🔍 Debugging Kolaylığı**:
   - 🔍 Redux DevTools ile state değişikliklerini izleme
   - 🚀 Hata ayıklama ve geliştirme sürecini hızlandırma

### 📁 Redux Toolkit ve Temel Bileşenler

```typescript
// store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async Action Creator
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials) => {
    const response = await HttpService.post('Auth/Login', credentials);
    return response.data;
  }
);

// Slice Definition
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
  }
});
```

### 📝 Komponentlerde Kullanım

```typescript
// Örnek Login Komponenti
const LoginPage = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await dispatch(login(credentials)).unwrap();
      // Başarılı giriş
      router.push('/dashboard');
    } catch (error) {
      // ErrorService otomatik hata gösterimi
    }
  };
};
```

### 🌐 HTTP Service ve Redux Entegrasyonu

```typescript
// shared/HttpService.tsx
class HttpService {
  private static instance: HttpService;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL
    });

    // Token Interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      }
    );

    // Error Interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        ErrorService.errorHandler(error);
        return Promise.reject(error);
      }
    );
  }
}
```

## 🗂️ Proje Yapısı

```
app/
├── (main)/         # Protected routes
│   ├── layout.tsx  # Auth layout
│   ├── login/      # Login page
│   └── pages/      # Protected pages
├── shared/         # Shared utilities
│   ├── HttpService.tsx
│   └── ErrorService.tsx
├── store/          # Redux store
│   ├── store.ts
│   └── slices/
│       └── authSlice.ts
└── layout/         # Layout components
    ├── AppTopbar.tsx
    └── AppMenu.tsx
```

## 📊 State Yönetimi Örnekleri

### 🔒 Kimlik Doğrulama
```typescript
// Kullanıcı Girişi
const handleLogin = async () => {
  try {
    await dispatch(login(credentials)).unwrap();
    router.push('/dashboard');
  } catch (error) {
    ErrorService.errorHandler(error);
  }
};

// Oturum Kontrolü
const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <Layout>{children}</Layout>;
};
```

### 📈 Veri Yönetimi
```typescript
// API'den Veri Çekme
const fetchData = createAsyncThunk(
  'data/fetch',
  async () => {
    const response = await HttpService.get('api/data');
    return response.data;
  }
);

// Komponente Entegrasyon
const DataComponent = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state: RootState) => state.data);

  useEffect(() => {
    dispatch(fetchData());
  }, []);

  if (loading) return <ProgressSpinner />;
  
  return <DataTable value={data} />;
};
```

## 🚀 Geliştirme Komutları

```bash
# Geliştirme sunucusu
npm run dev

# Prodüksiyon build
npm run build

# Lint düzeltmeleri
npm run lint
```

## 📚 Kullanılan Teknolojiler

- Next.js 14
- PrimeReact
- Redux Toolkit
- Axios
- JWT Decode
- TypeScript
