import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
    route('sign-in', 'routes/root/sign-in.tsx'),
    layout('routes/admin/admin-layout.tsx', [
        route('dashboard', 'routes/admin/dashboard.tsx'),
        route('allUsers', 'routes/admin/allUsers.tsx'),
        route('trips', 'routes/admin/trips.tsx'),
        route('trip/create', 'routes/admin/createTrip.tsx'),
    ])
] satisfies RouteConfig;