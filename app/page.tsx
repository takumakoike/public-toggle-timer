// import { prisma } from '@/globals/db';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <h1>Toggle Timer</h1>
        <div className="form-wrapper">
          <form action="" className=" flex flex-col items-center">
            <label htmlFor="userId">UserId</label>
            <input type="text" name="" id="userId" className="border"/>
            <label htmlFor="pass">パスワード</label>
            <input type="password" id="pass" className="border"/>
            <button type="submit">サインイン</button>
          </form>
        </div>
    </div>
  );
}
