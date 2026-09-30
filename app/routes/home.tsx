import type {Route} from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        {title: "New React Router App"},
        {name: "description", content: "Welcome to React Router!"},
    ];
}

export default function Home() {
    return (
        <main style={{fontFamily: "system-ui, sans-serif", padding: "4rem"}}>
            <h1>Hello World</h1>
            <p>Deployed with React Router on Vercel.</p>
        </main>
    );
}