// import "bootstrap/dist/css/bootstrap.min.css";
// import { useEffect } from "react";
// import Head from "next/head";

// export default function App({ Component, pageProps }) {
//   useEffect(() => {
//     // Adding Bootstrap JS for mobile navbar
//     import("bootstrap/dist/js/bootstrap.bundle.min.js");
//   }, []);

//   return (
//     <>
//       <Head>
//       <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>

//       </Head>
//       <Component {...pageProps} />
//     </>
//   );
// }
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js"); // ✅ Dynamically import Bootstrap JS
  }, []);

  return (
    <>
      <Head>
        <title>Expense (Expense tracker)</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
