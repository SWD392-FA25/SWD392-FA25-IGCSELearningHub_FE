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
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    loadCourses();
  }, [debouncedSearchTerm, selectedLevel, priceMin, priceMax, sortBy, pageNumber, pageSize]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await courseService.searchCourses({
        q: debouncedSearchTerm,
        level: selectedLevel,
        priceMin: priceMin ? parseFloat(priceMin) : undefined,
        priceMax: priceMax ? parseFloat(priceMax) : undefined,
        sort: sortBy,
        pageNumber,
        pageSize,
      });
      
      if (response.succeeded && response.data) {
        setCourses(response.data);
        setTotalPages(response.totalPages);
        setTotalItems(response.totalCount);
      } else {
        setError(response.message || "Failed to load courses");
        setCourses([]);
      }
    } catch (err) {
      setError("Failed to load courses. Please try again later.");
      console.error("Error loading courses:", err);
      setCourses([]);
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

  const availableLevels = ["AS Level", "A Level", "IGCSE"];

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLevel("");
    setPriceMin("");
    setPriceMax("");
    setSortBy("");
    setPageNumber(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPageNumber(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, pageNumber - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-md ${
            i === pageNumber
              ? "bg-primary text-primary-foreground"
              : "bg-background border border-border hover:bg-muted"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
          className="px-4 py-2 rounded-md bg-background border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-4 py-2 rounded-md bg-background border border-border hover:bg-muted"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        
        {pages}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-4 py-2 rounded-md bg-background border border-border hover:bg-muted"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={pageNumber === totalPages}
          className="px-4 py-2 rounded-md bg-background border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full h-10 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">All Levels</option>
                    {availableLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Min Price (VND)
                  </label>
                  <Input
                    type="number"
                    placeholder="Min price"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Max Price (VND)
                  </label>
                  <Input
                    type="number"
                    placeholder="Max price"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    min="0"
                  />
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
                    <option value="">Default</option>
                    <option value="title">Title (A-Z)</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    <option value="level">Level</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Showing {courses.length} of {totalItems} courses (Page {pageNumber} of {totalPages})
                </span>
                {(debouncedSearchTerm ||
                  selectedLevel ||
                  priceMin ||
                  priceMax ||
                  sortBy) && (
                  <span className="text-primary font-medium">
                    Filters applied
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {courses.length === 0 && !loading ? (
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
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {courses.map((course) => (
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
                
                {totalPages > 1 && renderPagination()}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
