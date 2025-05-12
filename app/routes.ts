import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    route('sign-in', 'routes/root/sign-in.tsx'),
    route('api/createTrip', 'routes/api/createTrip.ts'),
    layout('routes/admin/admin-layout.tsx', [
        route('dashboard', 'routes/admin/dashboard.tsx'),
        route('allUsers', 'routes/admin/allUsers.tsx'),
        route('trips', 'routes/admin/trips.tsx'),
        route('trip/create', 'routes/admin/createTrip.tsx'),
        route('trips/:tripId', 'routes/admin/tripDetail.tsx')
    ]),
    layout('routes/root/pageLayout.tsx', [index('routes/root/travelPage.tsx')])
] satisfies RouteConfig;