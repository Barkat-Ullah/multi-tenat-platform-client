"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ChevronRight,
  FileText,
  Edit3,
  Eye,
  Save,
  Plus,
  Trash2,
  Undo2,
  CheckCircle,
} from "lucide-react";
import {
  privacyPolicyIntro as initialIntro,
  privacyPolicySections as initialSections,
  PrivacyPolicySection,
} from "@/app/data/PrivacyPolicyData";
import { toast } from "sonner";

export default function PrivacyPolicyView() {
  const [activeTab, setActiveTab] = useState<"preview" | "edit">("preview");
  const [introText, setIntroText] = useState(initialIntro.text);
  const [lastUpdated, setLastUpdated] = useState(initialIntro.lastUpdated);
  const [sections, setSections] = useState<PrivacyPolicySection[]>(initialSections);

  // Preview Active Section State
  const [previewActiveSection, setPreviewActiveSection] = useState<string>(
    sections[0]?.id || ""
  );

  // Scroll preview section helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(`preview-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setPreviewActiveSection(id);
    }
  };

  // Section Editing Helpers
  const handleSectionTitleChange = (id: string, newTitle: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  const handleParagraphChange = (
    sectionId: string,
    pIdx: number,
    newValue: string
  ) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === sectionId) {
          const updatedContent = [...s.content];
          updatedContent[pIdx] = newValue;
          return { ...s, content: updatedContent };
        }
        return s;
      })
    );
  };

  const handleAddParagraph = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === sectionId) {
          return { ...s, content: [...s.content, ""] };
        }
        return s;
      })
    );
  };

  const handleRemoveParagraph = (sectionId: string, pIdx: number) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === sectionId) {
          return { ...s, content: s.content.filter((_, idx) => idx !== pIdx) };
        }
        return s;
      })
    );
  };

  const handleBulletChange = (
    sectionId: string,
    bIdx: number,
    newValue: string
  ) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === sectionId) {
          const updatedBullets = [...(s.bullets || [])];
          updatedBullets[bIdx] = newValue;
          return { ...s, bullets: updatedBullets };
        }
        return s;
      })
    );
  };

  const handleAddBullet = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === sectionId) {
          return { ...s, bullets: [...(s.bullets || []), ""] };
        }
        return s;
      })
    );
  };

  const handleRemoveBullet = (sectionId: string, bIdx: number) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === sectionId) {
          const filtered = (s.bullets || []).filter((_, idx) => idx !== bIdx);
          return { ...s, bullets: filtered.length > 0 ? filtered : undefined };
        }
        return s;
      })
    );
  };

  const handleAddSection = () => {
    const newId = `section-${Date.now()}`;
    const newSection: PrivacyPolicySection = {
      id: newId,
      title: `${sections.length + 1}. NEW SECTION TITLE`,
      content: ["This is a new paragraph of the privacy policy."],
    };
    setSections((prev) => [...prev, newSection]);
    toast.success("Added new section shell! Scroll down to edit.");
  };

  const handleRemoveSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    toast.info("Section removed.");
  };

  const handleSaveChanges = () => {
    toast.success("Privacy Policy changes saved successfully in dashboard state!");
  };

  const handleReset = () => {
    setIntroText(initialIntro.text);
    setLastUpdated(initialIntro.lastUpdated);
    setSections(initialSections);
    toast.info("Reset to default configuration.");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full max-w-[1600px] mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
            Privacy Policy Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-sans font-bold mt-1">
            Preview, configure, and revise the website's legal privacy document.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer outline-none active:scale-[0.98]"
          >
            <Undo2 size={14} />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSaveChanges}
            className="bg-[#00B2D6] hover:bg-[#009cb9] text-white px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2 transition-all shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none active:scale-[0.98]"
          >
            <Save size={15} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center border-b border-slate-100 pb-px">
        <button
          onClick={() => setActiveTab("preview")}
          className={`px-5 py-3 border-b-2 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer outline-none ${
            activeTab === "preview"
              ? "border-[#00B2D6] text-[#00B2D6]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Eye size={16} />
          <span>Live Preview</span>
        </button>
        <button
          onClick={() => setActiveTab("edit")}
          className={`px-5 py-3 border-b-2 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer outline-none ${
            activeTab === "edit"
              ? "border-[#00B2D6] text-[#00B2D6]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Edit3 size={16} />
          <span>Edit Policy Sections</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "preview" ? (
        /* PREVIEW PANEL */
        <div className="bg-[#FCFDFE] rounded-[28px] border border-slate-100/80 p-4 sm:p-6 md:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar Table of Contents */}
            <aside className="lg:w-[280px] w-full shrink-0 bg-white border border-slate-100 p-5 rounded-2xl shadow-[0_4px_20px_rgba(15,46,74,0.015)] hidden lg:block sticky top-28">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <FileText className="h-4.5 w-4.5 text-[#00B2D6]" />
                <h2 className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F2E4A]">
                  Table of Contents
                </h2>
              </div>
              <nav className="flex flex-col gap-1.5">
                {sections.map((section) => {
                  const isActive = previewActiveSection === section.id;
                  const cleanTitle = section.title.replace(/^\d+\.\s*/, "");
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold transition-all border-none outline-none cursor-pointer ${
                        isActive
                          ? "bg-[#EBF7FC] text-[#00B2D6] scale-[1.01]"
                          : "text-[#55697A] hover:bg-slate-50 hover:text-[#0F2E4A] bg-transparent"
                      }`}
                    >
                      {cleanTitle}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Main Content Render Area */}
            <main className="flex-1 bg-white border border-slate-100 p-6 sm:p-8 md:p-10 rounded-2xl shadow-[0_4px_20px_rgba(15,46,74,0.005)] min-w-0">
              <div className="mb-8 pb-6 border-b border-slate-100">
                <p className="text-[10px] font-extrabold text-[#00B2D6] uppercase tracking-widest mb-2">
                  Last Updated: {lastUpdated}
                </p>
                <p className="text-[#55697A] text-sm font-semibold leading-relaxed">
                  {introText}
                </p>
              </div>

              {/* Mobile Table of Contents */}
              <div className="mb-8 bg-slate-50/50 border border-slate-200/50 p-4 rounded-xl lg:hidden">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0F2E4A] mb-3">
                  Table of Contents
                </h3>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => scrollToSection(section.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00B2D6] hover:underline text-left leading-normal border-none bg-transparent outline-none cursor-pointer"
                      >
                        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                        <span>{section.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-10">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    id={`preview-${section.id}`}
                    className="scroll-mt-28 pb-10 border-b border-slate-100 last:border-none last:pb-0"
                  >
                    <h3 className="text-[#0F2E4A] font-extrabold text-base sm:text-lg tracking-tight mb-4 flex items-center gap-2">
                      <CheckCircle className="h-4.5 w-4.5 text-[#00B2D6] shrink-0" />
                      <span>{section.title}</span>
                    </h3>
                    <div className="space-y-4">
                      {section.content.map((p, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-[#55697A] text-xs sm:text-sm font-semibold leading-relaxed"
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                    {section.bullets && (
                      <ul className="list-disc pl-5 mt-4 space-y-2 text-[#55697A] text-xs sm:text-sm font-semibold leading-relaxed">
                        {section.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="pl-1">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      ) : (
        /* EDIT PANEL */
        <div className="space-y-6">
          {/* Metadata Section Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#0F2E4A] font-poppins pb-3 border-b border-slate-100">
              General Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
                  Last Updated Date
                </label>
                <textarea
                  rows={1}
                  value={lastUpdated}
                  onChange={(e) => setLastUpdated(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all resize-y"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
                  Introductory Paragraph
                </label>
                <textarea
                  rows={2}
                  value={introText}
                  onChange={(e) => setIntroText(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all resize-y"
                />
              </div>
            </div>
          </div>

          {/* List of sections to edit */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0F2E4A] font-poppins">
                Policy Content Sections ({sections.length})
              </h2>
              <button
                onClick={handleAddSection}
                className="bg-[#E6FAFF] hover:bg-[#D0F3FC] text-[#00B2D6] px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border-none outline-none"
              >
                <Plus size={14} className="stroke-[3]" />
                <span>Add Section</span>
              </button>
            </div>

            {sections.map((section, sIdx) => (
              <div
                key={section.id}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5 relative group"
              >
                {/* Trash Section button */}
                <button
                  type="button"
                  onClick={() => handleRemoveSection(section.id)}
                  className="absolute top-5 right-5 text-slate-300 hover:text-red-500 hover:scale-105 active:scale-95 transition-all p-1.5 rounded-full hover:bg-red-50 cursor-pointer border-none outline-none"
                  title="Delete Section"
                >
                  <Trash2 size={16} />
                </button>

                {/* Section Header Input */}
                <div className="w-full max-w-[80%]">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#00B2D6] mb-1">
                    Section {sIdx + 1} Title
                  </label>
                  <textarea
                    rows={1}
                    value={section.title}
                    onChange={(e) =>
                      handleSectionTitleChange(section.id, e.target.value)
                    }
                    className="w-full px-3 py-2 border-b border-transparent hover:border-slate-200 focus:border-[#00B2D6] focus:outline-none text-base sm:text-lg font-extrabold text-[#0F2E4A] font-poppins transition-all bg-transparent resize-y"
                  />
                </div>

                {/* Paragraph Content Items */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-50">
                    <label className="block text-xs font-bold text-slate-600 font-sans">
                      Paragraph Content
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAddParagraph(section.id)}
                      className="text-xs font-bold text-[#00B2D6] hover:underline flex items-center gap-1 cursor-pointer border-none outline-none bg-transparent"
                    >
                      <Plus size={12} className="stroke-[3]" />
                      <span>Add Paragraph</span>
                    </button>
                  </div>

                  {section.content.map((p, pIdx) => (
                    <div key={pIdx} className="flex gap-2 items-start">
                      <span className="text-xs font-bold text-slate-300 mt-3 select-none">
                        P{pIdx + 1}
                      </span>
                      <div className="flex-1 relative">
                        <textarea
                          rows={2}
                          value={p}
                          onChange={(e) =>
                            handleParagraphChange(
                              section.id,
                              pIdx,
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2.5 border border-slate-100 hover:border-slate-200 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-slate-500 font-semibold transition-all resize-y bg-slate-50/20"
                        />
                        {section.content.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveParagraph(section.id, pIdx)
                            }
                            className="absolute right-3 bottom-3 text-slate-300 hover:text-red-500 transition-colors cursor-pointer border-none bg-transparent outline-none"
                            title="Remove Paragraph"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bullet Items */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-50">
                    <label className="block text-xs font-bold text-slate-600 font-sans">
                      Bullets / Lists (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAddBullet(section.id)}
                      className="text-xs font-bold text-[#00B2D6] hover:underline flex items-center gap-1 cursor-pointer border-none outline-none bg-transparent"
                    >
                      <Plus size={12} className="stroke-[3]" />
                      <span>Add Bullet</span>
                    </button>
                  </div>

                  {(section.bullets || []).map((bullet, bIdx) => (
                    <div key={bIdx} className="flex gap-2 items-start">
                      <span className="text-xs font-bold text-slate-300 mt-3 select-none">
                        •
                      </span>
                      <div className="flex-1 relative">
                        <textarea
                          rows={1}
                          value={bullet}
                          onChange={(e) =>
                            handleBulletChange(section.id, bIdx, e.target.value)
                          }
                          className="w-full px-4 py-2 border border-slate-100 hover:border-slate-200 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-slate-500 font-semibold transition-all resize-y bg-slate-50/20"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(section.id, bIdx)}
                          className="absolute right-3 top-3.5 text-slate-300 hover:text-red-500 transition-colors cursor-pointer border-none bg-transparent outline-none"
                          title="Remove Bullet"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!section.bullets || section.bullets.length === 0) && (
                    <p className="text-[10px] text-slate-400 font-bold italic font-sans pl-2">
                      No list bullets configured for this section.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Save Row */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={handleReset}
              className="px-5 py-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer outline-none active:scale-[0.98]"
            >
              <Undo2 size={15} />
              <span>Reset</span>
            </button>
            <button
              onClick={handleSaveChanges}
              className="bg-[#00B2D6] hover:bg-[#009cb9] text-white px-7 py-3 rounded-full font-bold text-sm tracking-wide flex items-center gap-2 transition-all shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none active:scale-[0.98]"
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
