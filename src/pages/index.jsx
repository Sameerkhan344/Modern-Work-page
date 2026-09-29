// import Head from "next/head";
// import AwardsWork from "@/components/AwardsWork";
// import { projects } from "@/data/projects";

// export default function Home() {
//   return (
//     <>
//       <Head>
//         <title>Polish / Perfection — Selected Work</title>
//         <meta
//           name="description"
//           content="A premium circular 3D work slider built with Next.js, GSAP and Tailwind CSS 4."
//         />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//       </Head>
//       <AwardsWork projects={projects} />
//     </>
//   );
// }

// import Cartegory from "@/components/Cartegory";

// import { categories } from "@/data/categoryData";

// export default function Home() {
//   return (
//     <main>

//       {categories.map((category) => (
//         <Cartegory
//           key={category.id}
//           title={category.title}
//           subtitle={category.subtitle}
//           description={category.description}
//           data={category.data}
//         />
//       ))}
   
//     </main>
//   );
// }


// import Cartegory from "@/components/Cartegory";
// import { categories } from "@/data/categoryData";

// export default function Home() {
//   return (
//     <main>
//       {categories.map((category) => (
//         <Cartegory
//           key={category.id}
//           title={category.title}
//           subtitle={category.subtitle}
//           description={category.description}
//           data={category.data}
//         />
//       ))}
//     </main>
//   );
// }


import Cartegory from "@/components/Cartegory";
import { categories } from "@/data/categoryData";

export default function Home() {
  return (
    <main>
      {categories.map((category) => (
        <Cartegory
          key={category.id}
          id={category.id}
          title={category.title}
          subtitle={category.subtitle}
          description={category.description}
          data={category.data}
        />
      ))}
    </main>
  );
}

