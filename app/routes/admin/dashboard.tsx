import { Header, StatsCard, TripCard } from "components"
import { getAllUsers, getUser } from "~/appwrite/auth";
import type { Route } from './+types/dashboard'
import { getTripsByTravelStyle, getUserGrowthPerDay, getUsersAndTripsStats } from "~/appwrite/dashboard";
import { getAllTrips } from "~/appwrite/trips";
import { parseTripData } from "~/lib/utils";
import { Category, ChartComponent, ColumnDirective, ColumnsDirective, ColumnSeries, DataLabel, Inject, SeriesCollectionDirective, SeriesDirective, SplineAreaSeries, Tooltip } from "@syncfusion/ej2-react-charts";
import { tripXAxis, tripyAxis, userXAxis, useryAxis } from "~/constants";
import { GridComponent } from "@syncfusion/ej2-react-grids";

export const clientLoader = async () => {
    const [user,
        dashboardStats,
        trips,
        userGrowth,
        tripsByTravelStyle,
        allUsers,
    ] = await Promise.all([
        await getUser(),
        await getUsersAndTripsStats(),
        await getAllTrips(4, 0),
        await getUserGrowthPerDay(),
        await getTripsByTravelStyle(),
        await getAllUsers(4, 0)
    ])

    const allTrips = trips.allTrips.map(({ $id, tripDetail, imageUrls }) => ({
        id: $id,
        ...parseTripData(tripDetail),
        imageUrls: imageUrls ?? []
    }))

    const mappedUsers: UsersItineraryCount[] = allUsers.users.map((user) => ({
        imageUrl: user.imageUrl,
        name: user.name,
        count: user.count ?? Math.floor(Math.random() * 10)
    }))
    return {
        user, dashboardStats, allTrips, userGrowth, tripsByTravelStyle, allUsers: mappedUsers
    }
}


const dashboard = ({ loaderData }: Route.ComponentProps) => {
    const user = loaderData.user as User | null
    const { dashboardStats, allTrips, userGrowth, tripsByTravelStyle, allUsers } = loaderData

    const trips = allTrips.map((trip) => ({
        imageUrl: trip.imageUrls[0],
        name: trip.name,
        interest: trip.interests
    }))

    const { totalUsers, usersJoined, totalTrips, tripsCreated, userRole } = dashboardStats;
    const usersAndTrips = [
        {
            title: 'Latest user signups',
            dataSource: allUsers,
            field: `count`,
            headerText: 'Trips Created'
        },
        {
            title: 'Latest user signups',
            dataSource: allTrips,
            field: `interests`,
            headerText: 'Interersts'
        },
    ]
    return (
        <main className="dashboard wrapper">
            <Header title={`Welcome ${user?.name ?? 'Guest'}👋`}
                description="Track activity ,trends and popular destinations in real time" />

            <section className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <StatsCard
                        headerTitle='Total Users'
                        total={totalUsers}
                        currentMonthCount={usersJoined.currentMonth}
                        lastMonthCount={usersJoined.lastMonth}
                    />
                    <StatsCard
                        headerTitle='Total Trips'
                        total={totalTrips}
                        currentMonthCount={tripsCreated.currentMonth}
                        lastMonthCount={tripsCreated.lastMonth}
                    />
                    <StatsCard
                        headerTitle='Active Users Today'
                        total={userRole.total}
                        currentMonthCount={userRole.currentMonth}
                        lastMonthCount={userRole.lastMonth}
                    />
                </div>
            </section>
            <section className="container">
                <h1 className="text-xl font-semibold text-dark-100">Created Trips</h1>
                <div className="trip-grid">
                    {allTrips.map(({ id, name, imageUrls, itinerary, interests, travelStyle, estimatedPrice }) => (
                        <TripCard
                            key={id}
                            id={id.toString()}
                            name={name!}
                            imageUrl={imageUrls[0]}
                            location={itinerary?.[0]?.location ?? ''}
                            tags={[interests!, travelStyle!]}
                            price={estimatedPrice!}
                        />
                    ))}
                </div>
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ChartComponent id="chart-1"
                    primaryXAxis={userXAxis}
                    primaryYAxis={useryAxis}
                    title="User Growth"
                    tooltip={{ enable: true }}
                >
                    <Inject services={[ColumnSeries, SplineAreaSeries, Category, DataLabel, Tooltip]} />
                    <SeriesCollectionDirective>
                        <SeriesDirective
                            dataSource={userGrowth}
                            xName="day"
                            yName="count"
                            type="Column"
                            name="Column"
                            columnWidth={0.3}
                            cornerRadius={{ topLeft: 10, topRight: 10 }}
                        />
                        <SeriesDirective
                            dataSource={userGrowth}
                            xName="day"
                            yName="count"
                            type="SplineArea"
                            name="Wave"
                            fill="rgba(71,132,238,0.3)"
                            border={{ width: 2, color: '#4784EE' }}
                        />
                    </SeriesCollectionDirective>
                </ChartComponent>
                <ChartComponent id="chart-2"
                    primaryXAxis={tripXAxis}
                    primaryYAxis={tripyAxis}
                    title="Trip Trends"
                    tooltip={{ enable: true }}
                >
                    <Inject services={[ColumnSeries, SplineAreaSeries, Category, DataLabel, Tooltip]} />
                    <SeriesCollectionDirective>
                        <SeriesDirective
                            dataSource={tripsByTravelStyle}
                            xName="travel style"
                            yName="count"
                            type="Column"
                            name="day"
                            columnWidth={0.3}
                            cornerRadius={{ topLeft: 10, topRight: 10 }}
                        />
                    </SeriesCollectionDirective>
                </ChartComponent>
            </section>
            <section className="user-trip wrapper">
                {usersAndTrips.map(({ title, dataSource, field, headerText }, i) => (
                    <div key={i} className="flex flex-col gap-5">
                        <h3 className="p-20-semibold text-dark-100">{title}</h3>

                        <GridComponent dataSource={dataSource} gridLines="None">
                            <ColumnsDirective>
                                <ColumnDirective
                                    field="name"
                                    headerText="Name"
                                    width="200"
                                    textAlign="Left"
                                    template={(props: any) => (
                                        <div className="flex items-center gap-1.5 px-4">
                                            {props.imageUrl || props.imageUrls?.[0] ? (
                                                <img
                                                    src={props.imageUrl || props.imageUrls?.[0]}
                                                    alt="user"
                                                    className="rounded-full size-8 aspect-square"
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : null}
                                            <span>{props.name}</span>
                                        </div>
                                    )}
                                />

                                <ColumnDirective
                                    field={field}
                                    headerText={headerText}
                                    width="150"
                                    textAlign="Left"
                                />
                            </ColumnsDirective>
                        </GridComponent>
                    </div>
                ))}
            </section>
        </main>
    )
}

export default dashboard