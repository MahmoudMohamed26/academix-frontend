import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function RootPage() {
  // Await the cookies() promise
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get('NEXT_LOCALE')?.value;
  
  // Redirect to saved locale or default to 'en'
  const locale = savedLocale || 'en';
  redirect(`/${locale}`);
}