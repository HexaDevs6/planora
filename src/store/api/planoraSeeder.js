// src/store/api/planoraSeeder.js

import { createDocumentWithId } from "./firestoreHelpers";

/**
 * 🌱 Planora Seeder
 * This script inserts example data into Firestore collections:
 * users, services, events, bookings, and reviews.
 *
 * ⚠️ Run this script ONCE (for example, from an admin panel button)
 * to initialize the database with demo data.
 */

export const seedPlanoraData = async () => {
    try {
        console.log("🌱 Starting Planora database seeding...");

        // ────────────────────────────────
        // 👤 USERS COLLECTION
        // ────────────────────────────────
        // Each user object represents a registered person in the app
        // role = "client" (attends events or books services)
        // role = "host" (creates events and provides services)
        const users = [
            {
                name: "Moustafa Hawash",
                email: "moustafa@planora.com",
                role: "client",
                avatar: "https://i.pravatar.cc/150?img=1",
                phone: "+201112345678",
                bio: "Frontend developer and event enthusiast.",
            },
            {
                name: "Mahmoud Abu-Attiya",
                email: "mahmoud@planora.com",
                role: "host",
                avatar: "https://i.pravatar.cc/150?img=2",
                phone: "+201155544433",
                bio: "Event host specializing in tech meetups.",
            },
            {
                name: "Mariam Hamido",
                email: "mariam@planora.com",
                role: "host",
                avatar: "https://i.pravatar.cc/150?img=2",
                phone: "+201155544433",
                bio: "Event host specializing in tech meetups.",
            },
            {
                name: "Nadeen Ahmed",
                email: "nadeen@planora.com",
                role: "client",
                avatar: "https://i.pravatar.cc/150?img=2",
                phone: "+201155544433",
                bio: "Event host specializing in tech meetups.",
            },
            {
                name: "Mohamed Ahmed",
                email: "mohamed@planora.com",
                role: "host",
                avatar: "https://i.pravatar.cc/150?img=2",
                phone: "+201155544433",
                bio: "Event host specializing in tech meetups.",
            },
            {
                name: "Islam Adel",
                email: "islam@planora.com",
                role: "client",
                avatar: "https://i.pravatar.cc/150?img=2",
                phone: "+201155544433",
                bio: "Event host specializing in tech meetups.",
            },
        ];

        // Store all generated user IDs after insertion
        const userIds = [];

        // Loop through each user and add to Firestore
        for (const user of users) {
            const id = await createDocumentWithId("users", user);
            userIds.push(id);
        }

        console.log("✅ Users added:", userIds);

        // ────────────────────────────────
        // 🧰 SERVICES COLLECTION
        // ────────────────────────────────
        // Each service represents an offering by a host (e.g., catering, photography)
        const services = [
            {
                title: "Catering Service",
                description:
                    "Full-service catering for conferences and events.",
                category: "Food & Beverage",
                priceRange: "$500 - $2000",
                providerId: userIds[1], // Linked to host user
                rating: 4.7,
                city: "Cairo",
            },
            {
                title: "Photography Package",
                description: "Professional event photography with editing.",
                category: "Media",
                priceRange: "$300 - $1500",
                providerId: userIds[1],
                rating: 4.9,
                city: "Alexandria",
            },
        ];

        const serviceIds = [];

        // Loop through each service and create Firestore document
        for (const service of services) {
            const id = await createDocumentWithId("services", service);
            serviceIds.push(id);
        }

        console.log("✅ Services added:", serviceIds);

        // ────────────────────────────────
        // 🎉 EVENTS COLLECTION
        // ────────────────────────────────
        // Events are created by hosts and can have related services
        const events = [
            {
                title: "Planora Tech Meetup",
                description:
                    "A gathering for developers, designers, and innovators.",
                hostId: userIds[1], // Host from users collection
                location: "ITI Damanhour",
                date: "2025-11-25T18:00:00Z",
                price: 0,
                attendeesCount: 0,
                services: [serviceIds[0], serviceIds[1]], // Related services
                banner: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
            },
            {
                title: "Creative Photography Workshop",
                description:
                    "Learn event photography and post-production techniques.",
                hostId: userIds[1],
                location: "Alexandria Arts Center",
                date: "2025-12-10T14:00:00Z",
                price: 50,
                attendeesCount: 0,
                services: [serviceIds[1]],
                banner: "https://images.pexels.com/photos/1767434/pexels-photo-1767434.jpeg",
            },
        ];

        const eventIds = [];

        // Add each event and store their Firestore IDs
        for (const event of events) {
            const id = await createDocumentWithId("events", event);
            eventIds.push(id);
        }

        console.log("✅ Events added:", eventIds);

        // ────────────────────────────────
        // 🎟️ BOOKINGS COLLECTION
        // ────────────────────────────────
        // Each booking links a user to an event, showing participation or ticket purchase
        const bookings = [
            {
                eventId: eventIds[0], // Link to Planora Tech Meetup
                userId: userIds[0], // Moustafa
                status: "confirmed", // confirmed | pending | cancelled
                tickets: 2,
                totalPrice: 0,
            },
            {
                eventId: eventIds[1], // Link to Photography Workshop
                userId: userIds[0],
                status: "pending",
                tickets: 1,
                totalPrice: 50,
            },
        ];

        const bookingIds = [];

        // Add each booking document to Firestore
        for (const booking of bookings) {
            const id = await createDocumentWithId("bookings", booking);
            bookingIds.push(id);
        }

        console.log("✅ Bookings added:", bookingIds);

        // ────────────────────────────────
        // ⭐ REVIEWS COLLECTION
        // ────────────────────────────────
        // Reviews can be for either an event or a service
        const reviews = [
            {
                userId: userIds[0],
                eventId: eventIds[0],
                rating: 5,
                comment: "Amazing event! Learned a lot and met great people.",
            },
            {
                userId: userIds[0],
                serviceId: serviceIds[1],
                rating: 4.8,
                comment: "Photography quality was top-notch!",
            },
        ];

        const reviewIds = [];

        // Insert reviews one by one
        for (const review of reviews) {
            const id = await createDocumentWithId("reviews", review);
            reviewIds.push(id);
        }

        console.log("✅ Reviews added:", reviewIds);

        // ────────────────────────────────
        // ✅ FINAL LOG
        // ────────────────────────────────
        console.log("🎉 Planora seeding completed successfully!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    }
};
