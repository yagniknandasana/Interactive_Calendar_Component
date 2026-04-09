import WallCalendar from "@/components/calendar/WallCalendar";

const Index = () => (
  <div
    className="min-h-screen bg-wall py-12 px-4 flex flex-col items-center"
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='60' height='60' fill='%23e8e2d8'/%3E%3Crect x='0' y='0' width='30' height='30' fill='%23e5dfd4' opacity='0.4'/%3E%3C/svg%3E\")",
    }}
  >
    {/* Page header */}
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Wall Calendar 2025</h1>
      <p className="text-sm text-muted-foreground mt-1">Select date ranges and add your notes</p>
    </div>

    <WallCalendar />
  </div>
);

export default Index;
