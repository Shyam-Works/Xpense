import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <nav>
        <ul>
          <li><Link href="/home/income">Income</Link></li>
          <li><Link href="/home/expense">Expense</Link></li>
          <li><Link href="/home/dashboard">Dashboard</Link></li>
        </ul>
      </nav>
    </div>
  );
}
