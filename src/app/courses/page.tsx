"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { courseService } from "@/services/course-service";
import { CourseSummary } from "@/types/api-types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("title");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const highlightSearchTerm = (text: string, term: string): React.ReactNode => {
    if (!term.trim()) return text;

    const regex = new RegExp(
      `(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 text-yellow-900 px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getAllCourses();
      if (response.succeeded && response.data) {
        setCourses(response.data);
      } else {
        setError(response.message || "Failed to load courses");
      }
    } catch (err) {
      setError("Failed to load courses. Please try again later.");
      console.error("Error loading courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (!price || price <= 0) return "Free";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const availableLevels = useMemo(() => {
    const levels = [...new Set(courses.map((course) => course.level))];
    return levels.filter(Boolean).sort();
  }, [courses]);

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase());

      const matchesLevel =
        selectedLevel === "all" || course.level === selectedLevel;

      let matchesPrice = true;
      if (priceRange === "free") {
        matchesPrice = !course.price || course.price <= 0;
      } else if (priceRange === "under-1m") {
        matchesPrice = course.price > 0 && course.price < 1000000;
      } else if (priceRange === "1m-5m") {
        matchesPrice = course.price >= 1000000 && course.price <= 5000000;
      } else if (priceRange === "over-5m") {
        matchesPrice = course.price > 5000000;
      }

      return matchesSearch && matchesLevel && matchesPrice;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "level":
          return a.level.localeCompare(b.level);
        default:
          return 0;
      }
    });

    return filtered;
  }, [courses, debouncedSearchTerm, selectedLevel, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLevel("all");
    setPriceRange("all");
    setSortBy("title");
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button
              onClick={loadCourses}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <section className="w-full py-16 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Courses
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose from our comprehensive selection of IGCSE courses taught by
              expert instructors
            </p>
          </div>
        </section>

        <section className="w-full py-8 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <Input
                    type="text"
                    placeholder="Search courses by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10"
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setSearchTerm("");
                      }
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="whitespace-nowrap"
                >
                  Clear Filters
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full h-10 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="all">All Levels</option>
                    {availableLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price Range
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full h-10 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="all">All Prices</option>
                    <option value="free">Free</option>
                    <option value="under-1m">Under 1,000,000 VND</option>
                    <option value="1m-5m">1,000,000 - 5,000,000 VND</option>
                    <option value="over-5m">Over 5,000,000 VND</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full h-10 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="title">Title (A-Z)</option>
                    <option value="price-low">Price (Low to High)</option>
                    <option value="price-high">Price (High to Low)</option>
                    <option value="level">Level</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Showing {filteredAndSortedCourses.length} of {courses.length}{" "}
                  courses
                </span>
                {(debouncedSearchTerm ||
                  selectedLevel !== "all" ||
                  priceRange !== "all" ||
                  sortBy !== "title") && (
                  <span className="text-primary font-medium">
                    {debouncedSearchTerm ? "Search active" : "Filters applied"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {courses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No courses available at the moment.
                </p>
              </div>
            ) : filteredAndSortedCourses.length === 0 ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No courses found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    No courses match your current search and filter criteria.
                  </p>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-muted-foreground">Try:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Using different keywords</li>
                      <li>• Checking your spelling</li>
                      <li>• Removing some filters</li>
                      <li>• Browsing all courses</li>
                    </ul>
                  </div>
                  <Button variant="primary" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="group p-6 border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer bg-card relative"
                  >
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {highlightSearchTerm(course.title, debouncedSearchTerm)}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {course.shortDescription &&
                        highlightSearchTerm(
                          course.shortDescription,
                          debouncedSearchTerm
                        )}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Level</span>
                        <span className="font-medium text-foreground">
                          {course.level}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Quizzes</span>
                        <span className="font-medium text-foreground">
                          {course.totalQuizzes}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Assignments
                        </span>
                        <span className="font-medium text-foreground">
                          {course.totalAssignments}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-medium text-primary">
                          {formatPrice(course.price)}
                        </span>
                      </div>
                    </div>

                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
                      View Details
                    </button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
