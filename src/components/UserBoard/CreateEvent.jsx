import React, { useState } from "react";

export default function PublishEvent() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    location: "",
    date: "",
    time: "",
    duration: "",
    price: "",
    type: "public",
    image: null,
  });

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;
    setFormData({
      ...formData,
      [id]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event Data:", formData);
    alert("✅ Event Published Successfully!");
  };

  return (
    <section className="min-h-screen justify-center items-center bg-background text-content  transition-colors duration-500">
      <div className="w-full  bg-white dark:bg-foreground/5 backdrop-blur-lg border border-content/20 shadow-lg rounded-[var(--radius)] p-8 md:p-12 transition-all duration-300">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Publish Event
          </h1>
          <p className="text-content/80">
            Fill in the details below to publish your event.
          </p>
        </header>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
        >
          {/* Event Name */}
          <div className="">
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Event Name
            </label>
            <input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter event name"
              className="w-full rounded-[var(--radius)] border border-content/20 bg-foreground/5 px-4 py-3 focus:ring-2 focus:ring-amber outline-none placeholder:text-content/60"
            />
          </div>

          {/* Category */}
          <div className="">
            <label htmlFor="category" className="block text-sm font-semibold mb-2">
              Event Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full text-text rounded-[var(--radius)] border border-content/20 bg-foreground/5 px-4 py-3 focus:ring-2 focus:ring-amber outline-none"
            >
              <option value="">Select category</option>
              <option>Conference</option>
              <option>Workshop</option>
              <option>Webinar</option>
              <option>Meetup</option>
            </select>
          </div>
          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-semibold mb-2">
              Event Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event"
              rows="4"
              className="w-full rounded-[var(--radius)] border border-content/20 bg-foreground/5 px-4 py-3 focus:ring-2 focus:ring-amber outline-none placeholder:text-content/60"
            />
          </div>


          {/* Location */}
          <div className="md:col-span-2">
            <label htmlFor="location" className="block text-sm font-semibold mb-2">
              Event Location
            </label>
            <input
              id="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., 'Online' or '123 Main St, Anytown'"
              className="w-full rounded-[var(--radius)] border border-content/20 bg-foreground/5 px-4 py-3 focus:ring-2 focus:ring-amber outline-none placeholder:text-content/60"
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-semibold mb-2">
              Event Date
            </label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-[var(--radius)] border border-content/20 bg-foreground/5 px-4 py-3 focus:ring-2 focus:ring-amber outline-none text-content"
            />
          </div>

          {/* Time */}
          <div>
            <label htmlFor="time" className="block text-sm font-semibold mb-2">
              Event Time
            </label>
            <input
              id="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full rounded-[var(--radius)] border border-content/20 bg-foreground/5 px-4 py-3 focus:ring-2 focus:ring-amber outline-none text-content"
            />
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-semibold mb-2">
              Event Duration
            </label>
            <input
              id="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 2 hours"
              className="w-full rounded-[var(--radius)] border border-content/20 bg-foreground/5 px-4 py-3 focus:ring-2 focus:ring-amber outline-none placeholder:text-content/60"
            />
          </div>

          {/* Ticket Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-semibold mb-2">
              Ticket Price
            </label>
            <input
              id="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., $25 or Free"
              className="w-full rounded-[var(--radius)] border border-content/20 bg-foreground/5 px-4 py-3 focus:ring-2 focus:ring-amber outline-none placeholder:text-content/60"
            />
          </div>

          {/* Event Type */}
          <div className="md:col-span-2">
            <p className="block text-sm font-semibold mb-2">Event Type</p>
            <div className="flex gap-4">
              {["public", "private"].map((type) => (
                <label
                  key={type}
                  className={`flex-1 flex items-center justify-center gap-2 cursor-pointer border-2 rounded-[var(--radius)] py-3 transition-all ${
                    formData.type === type
                      ? "border-amber bg-amber-light/20"
                      : "border-content/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={() => setFormData({ ...formData, type })}
                    className="hidden"
                  />
                  <span className="capitalize text-sm font-medium text-primary">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Upload Image */}
          <div className="md:col-span-2">
            <label htmlFor="image" className="block text-sm font-semibold mb-2">
              Event Image
            </label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-content/30 rounded-[var(--radius)] py-10 bg-foreground/5 hover:bg-foreground/10 transition-colors">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="cursor-pointer text-amber hover:text-amber-dark font-medium"
              >
                Click to upload or drag & drop
              </label>
              <p className="text-xs text-content/70 mt-2">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-amber text-white font-semibold py-3 px-8 rounded-[var(--radius)] hover:bg-amber-dark focus:ring-4 focus:ring-amber-light/40 transition-all shadow-md"
            >
              Publish Event
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
