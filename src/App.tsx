import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Rocket, Palette, Leaf } from "lucide-react";

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-50 via-background to-green-100 p-8">
      <main className="flex w-full max-w-4xl flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary fill-primary" />
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
              Welcome to Your App
            </h1>
            <Leaf className="h-8 w-8 text-primary fill-primary" />
          </div>
          <p className="max-w-md text-muted-foreground">
            Start building something amazing. This template is ready for you to
            customize.
          </p>
        </div>

        <div className="grid w-full gap-6 md:grid-cols-2">
          <Card className="border-green-200 shadow-green-100 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                <CardTitle>Quick Start</CardTitle>
              </div>
              <CardDescription>
                Everything is set up and ready to go. Just start making changes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Get Started</Button>
            </CardContent>
          </Card>

          <Card className="border-green-200 shadow-green-100 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <CardTitle>Customizable</CardTitle>
              </div>
              <CardDescription>
                Beautiful components that you can easily modify to match your
                brand.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default App;
