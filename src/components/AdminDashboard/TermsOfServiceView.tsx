"use client";

import React, { useState } from "react";
import { Plus, Trash2, Undo2, Save, Edit3, ArrowLeft } from "lucide-react";
import {
  termsIntro as initialIntro,
  termsSections as initialSections,
  TermsSection,
} from "@/app/data/TermsData";
import { toast } from "sonner";

export default function TermsOfServiceView() {
  const [isEditing, setIsEditing] = useState(false);
  const [subtitle, setSubtitle] = useState(initialIntro.subtitle);
  const [footerText, setFooterText] = useState(initialIntro.footerText);
  const [sections, setSections] = useState<TermsSection[]>(initialSections);

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
    const newSection: TermsSection = {
      id: newId,
      title: `${sections.length + 1}. New Terms Section`,
      content: ["This is a new terms of service clause paragraph."],
    };
    setSections((prev) => [...prev, newSection]);
    toast.success("Added new terms section! Scroll down to edit.");
  };

  const handleRemoveSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    toast.info("Terms section removed.");
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    toast.success("Terms & Conditions changes saved successfully!");
  };

  const handleReset = () => {
    setSubtitle(initialIntro.subtitle);
    setFooterText(initialIntro.footerText);
    setSections(initialSections);
    setIsEditing(false);
    toast.info("Reset to default configuration.");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full max-w-[1200px] mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          Terms & Conditions
        </h1>
        
        {/* Toggle Edit Button */}
        <button
          onClick={() => {
            if (isEditing) {
              handleSaveChanges();
            } else {
              setIsEditing(true);
            }
          }}
          className="bg-[#00B2D6] hover:bg-[#009cb9] text-white px-6 py-2 rounded-full font-bold text-xs sm:text-sm tracking-wide flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border-none outline-none active:scale-[0.98]"
        >
          {isEditing ? <Save size={15} /> : <Edit3 size={14} />}
          <span>{isEditing ? "Save" : "Edit"}</span>
        </button>
      </div>

      {/* Main Content Card Container */}
      <div className="bg-white rounded-[28px] border border-slate-100/90 p-6 sm:p-8 md:p-10 shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
        {!isEditing ? (
          /* READ ONLY VIEW MODE - EXACTLY LIKE MOCKUP */
          <div className="space-y-6">
            <h2 className="text-[#0F2E4A] text-lg font-bold font-poppins mb-6">
              Terms & Conditions
            </h2>

            <div className="space-y-8">
              {sections.map((section) => (
                <div key={section.id} className="space-y-2">
                  <h3 className="text-[#0F2E4A] font-extrabold text-sm sm:text-base font-poppins leading-snug">
                    {section.title}
                  </h3>
                  
                  <div className="space-y-3">
                    {section.content.map((p, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-[#55697A] text-xs sm:text-sm font-semibold font-sans leading-relaxed"
                      >
                        {p}
                      </p>
                    ))}
                  </div>

                  {section.bullets && (
                    <ul className="list-disc pl-5 mt-2 space-y-1.5 text-[#55697A] text-xs sm:text-sm font-semibold font-sans leading-relaxed">
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

            {/* Bottom Footer Info */}
            <div className="pt-8 border-t border-slate-100 mt-10">
              <p className="text-[11px] sm:text-xs text-[#00B2D6] font-bold font-sans">
                {footerText}
              </p>
            </div>
          </div>
        ) : (
          /* INTERACTIVE EDIT MODE */
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#0F2E4A] font-poppins">
                Edit Content Details
              </h2>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer border-none bg-transparent outline-none"
              >
                <ArrowLeft size={12} />
                <span>Cancel</span>
              </button>
            </div>

            {/* General Subtitle / Footer Config */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100/65">
              <div>
                <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
                  Subtitle Intro
                </label>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all resize-y"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
                  Footer Company Info
                </label>
                <textarea
                  rows={2}
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all resize-y"
                />
              </div>
            </div>

            {/* Content Sections List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Terms Sections ({sections.length})
                </h3>
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
                  className="bg-slate-50/50 border border-slate-200/50 rounded-2xl p-5 space-y-4 relative group"
                >
                  {/* Delete section button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(section.id)}
                    className="absolute top-5 right-5 text-slate-300 hover:text-red-500 hover:scale-105 active:scale-95 transition-all p-1.5 rounded-full hover:bg-red-50 cursor-pointer border-none outline-none"
                    title="Delete Section"
                  >
                    <Trash2 size={15} />
                  </button>

                  {/* Section Title Input */}
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
                      className="w-full px-3 py-1.5 border-b border-slate-200 hover:border-slate-300 focus:border-[#00B2D6] focus:outline-none text-sm sm:text-base font-extrabold text-[#0F2E4A] font-poppins transition-all bg-transparent resize-y"
                    />
                  </div>

                  {/* Section Paragraphs */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <label className="block text-xs font-bold text-slate-500 font-sans">
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
                        <span className="text-xs font-bold text-slate-300 mt-2 select-none">
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
                            className="w-full px-4 py-2 border border-slate-250/80 rounded-xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-slate-500 font-semibold transition-all resize-y bg-white"
                          />
                          {section.content.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveParagraph(section.id, pIdx)
                              }
                              className="absolute right-3 bottom-3.5 text-slate-300 hover:text-red-500 transition-colors cursor-pointer border-none bg-transparent outline-none"
                              title="Remove Paragraph"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Section Bullets */}
                  <div className="space-y-3.5 pt-1">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <label className="block text-xs font-bold text-slate-500 font-sans">
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
                        <span className="text-xs font-bold text-slate-300 mt-2 select-none">
                          •
                        </span>
                        <div className="flex-1 relative">
                          <textarea
                            rows={1}
                            value={bullet}
                            onChange={(e) =>
                              handleBulletChange(
                                section.id,
                                bIdx,
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 border border-slate-250/80 rounded-xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-slate-500 font-semibold transition-all resize-y bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveBullet(section.id, bIdx)}
                            className="absolute right-3 top-3 text-slate-300 hover:text-red-500 transition-colors cursor-pointer border-none bg-transparent outline-none"
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

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer outline-none active:scale-[0.98]"
              >
                <Undo2 size={14} />
                <span>Reset Defaults</span>
              </button>
              <button
                onClick={handleSaveChanges}
                className="bg-[#00B2D6] hover:bg-[#009cb9] text-white px-7 py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wide flex items-center gap-1.5 transition-all shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none active:scale-[0.98]"
              >
                <Save size={14} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
