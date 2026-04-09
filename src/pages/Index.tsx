import WallCalendar from "@/components/calendar/WallCalendar";

const Index = () => (
  <div
    className="min-h-screen py-14 px-4 flex flex-col items-center"
    style={{
      background: `
        radial-gradient(ellipse at 50% 30%, hsl(30 15% 92%) 0%, hsl(30 12% 86%) 60%, hsl(25 10% 80%) 100%)
      `,
      backgroundImage: `
        radial-gradient(ellipse at 50% 30%, hsl(30 15% 92%) 0%, hsl(30 12% 86%) 60%, hsl(25 10% 80%) 100%),
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")
      `,
    }}
  >
    {/* Page header */}
    <div className="text-center mb-10 animate-fade-in">
      <h1
        className="text-3xl font-bold tracking-tight"
        style={{ color: "hsl(var(--foreground))" }}
      >
        Wall Calendar 2025
      </h1>
      <p
        className="text-sm mt-1.5 tracking-wide"
        style={{ color: "hsl(var(--muted-foreground) / 0.7)" }}
      >
        Select date ranges and add your notes
      </p>
    </div>

    <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <WallCalendar />
    </div>
  </div>
);

export default Index;
