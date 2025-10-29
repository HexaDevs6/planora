import React, { useState } from "react";
import { Search, Filter, Eye, Edit3, Trash2 } from "lucide-react";

const eventsData = [
    {
        id: "evt_001",
        title: "Tech Innovators Summit 2025",
        date: "2025-11-10",
        time: "09:00 AM",
        location: "Cairo International Convention Center",
        category: "Technology",
        status: "Upcoming",
        attendees: 342,
        host: {
            name: "Planora Events",
            avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
        },
    },
    {
        id: "evt_002",
        title: "Music Fest Alexandria",
        date: "2025-09-15",
        time: "06:30 PM",
        location: "Alexandria Corniche Arena",
        category: "Entertainment",
        status: "Completed",
        attendees: 980,
        host: {
            name: "SoundWave Egypt",
            avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
        },
    },
    {
        id: "evt_003",
        title: "Startup Pitch Night",
        date: "2025-10-29",
        time: "07:00 PM",
        location: "Greek Campus, Cairo",
        category: "Business",
        status: "Ongoing",
        attendees: 120,
        host: {
            name: "Cairo Startups",
            avatar: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg",
        },
    },
    {
        id: "evt_004",
        title: "Food & Art Festival",
        date: "2025-12-05",
        time: "12:00 PM",
        location: "Giza Cultural Park",
        category: "Culture",
        status: "Upcoming",
        attendees: 750,
        host: {
            name: "FlavorArt Egypt",
            avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
        },
    },
];

const EventsTable = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    // Filtering logic
    const filteredEvents = eventsData.filter((event) => {
        const matchesSearch =
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.host.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            filterStatus === "All" || event.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className='space-y-5'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center'>
                <h2 className='text-2xl font-bold text-primary'>
                    Events Overview
                </h2>

                <div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto'>
                    {/* Search */}
                    <div className='relative flex items-center w-full sm:w-64'>
                        <Search
                            className='absolute left-3 text-subtext-light dark:text-subtext-dark'
                            size={16}
                        />
                        <input
                            type='text'
                            placeholder='Search events...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-full rounded-sm bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 transition'
                        />
                    </div>

                    {/* Filter */}
                    <div className='relative flex items-center'>
                        <Filter
                            className='absolute left-3 text-subtext-light dark:text-subtext-dark'
                            size={16}
                        />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className='appearance-none w-full sm:w-44 rounded-sm bg-background border border-border-light dark:border-border-dark pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 transition cursor-pointer'
                        >
                            <option value='All'>All Statuses</option>
                            <option value='Upcoming'>Upcoming</option>
                            <option value='Ongoing'>Ongoing</option>
                            <option value='Completed'>Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className='overflow-x-auto bg-content-light dark:bg-content-dark rounded-lg shadow-subtle'>
                <table className='min-w-full divide-y divide-border-light dark:divide-border-dark'>
                    <thead className='bg-gray-50 dark:bg-gray-800/40'>
                        <tr>
                            {[
                                "Event",
                                "Date & Time",
                                "Location",
                                "Category",
                                "Attendees",
                                "Status",
                                "Actions",
                            ].map((heading) => (
                                <th
                                    key={heading}
                                    className='px-4 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider'
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className='divide-y divide-border-light dark:divide-border-dark'>
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => (
                                <tr
                                    key={event.id}
                                    className='hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors'
                                >
                                    {/* Event */}
                                    <td className='px-4 py-4 whitespace-nowrap flex items-center gap-3'>
                                        <img
                                            src={event.host.avatar}
                                            alt={event.title}
                                            className='w-10 h-10 rounded-sm object-cover'
                                        />
                                        <div>
                                            <p className='text-sm font-semibold text-primary'>
                                                {event.title}
                                            </p>
                                            <p className='text-xs text-subtext-light dark:text-subtext-dark'>
                                                by {event.host.name}
                                            </p>
                                        </div>
                                    </td>

                                    {/* Date & Time */}
                                    <td className='px-4 py-4 whitespace-nowrap text-sm'>
                                        {event.date} <br />
                                        <span className='text-xs text-subtext-light dark:text-subtext-dark'>
                                            {event.time}
                                        </span>
                                    </td>

                                    {/* Location */}
                                    <td className='px-4 py-4 whitespace-nowrap text-sm text-subtext-light dark:text-subtext-dark'>
                                        {event.location}
                                    </td>

                                    {/* Category */}
                                    <td className='px-4 py-4 whitespace-nowrap text-sm'>
                                        {event.category}
                                    </td>

                                    {/* Attendees */}
                                    <td className='px-4 py-4 whitespace-nowrap text-sm font-semibold'>
                                        {event.attendees}
                                    </td>

                                    {/* Status */}
                                    <td className='px-4 py-4 whitespace-nowrap'>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                event.status === "Upcoming"
                                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                                                    : event.status === "Ongoing"
                                                    ? "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300"
                                                    : "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                                            }`}
                                        >
                                            {event.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className='px-4 py-4 whitespace-nowrap text-right text-sm'>
                                        <div className='flex items-center gap-2 justify-end'>
                                            <button
                                                title='View Event'
                                                className='p-2 text-primary hover:bg-primary/10 rounded-md transition'
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                title='Edit'
                                                className='p-2 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-md transition'
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                title='Delete'
                                                className='p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-md transition'
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan='7'
                                    className='px-4 py-10 text-center'
                                >
                                    <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-12'>
                                        <h3 className='text-lg font-semibold text-text-light-primary dark:text-text-dark-primary'>
                                            No Events Found
                                        </h3>
                                        <p className='text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1'>
                                            Try adjusting your search or
                                            filters.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EventsTable;
