import { NextResponse } from 'next/server';

const API_URL = 'http://localhost:8000/analysis';

export async function GET() {
  try {
    console.log('API isteği gönderiliyor...', API_URL);
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API yanıt hatası:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('API yanıtı:', data);
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Veri analizi sırasında hata:', error);
    return NextResponse.json(
      { error: 'Veri analizi sırasında bir hata oluştu: ' + (error as Error).message },
      { status: 500 }
    );
  }
} 