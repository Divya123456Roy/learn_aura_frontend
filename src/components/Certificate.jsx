import React from 'react';
import { jsPDF } from 'jspdf';
import { useQuery } from '@tanstack/react-query';
import { generateCertificateAPI } from '../services/courseAPI';
import { useParams } from 'react-router-dom';

const Certificate = ({
  completionDate = Date.now(),
  organization = 'LearnAura',
}) => {
  const { courseId } = useParams();
  const { data } = useQuery({
    queryKey: ["generate-certificate"],
    queryFn: () => generateCertificateAPI(courseId),
  });

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(completionDate));

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: 'a4',
    });

    // Define dimensions (A4 in landscape at 72 DPI: 842px x 595px)
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
     // Reduced margin to fit more content

    // Plain white background
    doc.setFillColor(255, 255, 255); // White
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Simple black border
    doc.setDrawColor(0, 0, 0); // Black
    doc.setLineWidth(4);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

    // Top: Organization Name ("LearnAura")
    doc.setFontSize(20); // Reduced font size
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(23, 37, 84); // Blue-900
    doc.text(organization, pageWidth / 2, margin + 30, { align: 'center' });

    // Certificate Title ("Certificate of Completion")
    doc.setFontSize(32); // Reduced font size
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(0, 0, 0); // Black
    doc.text('Certificate of Completion', pageWidth / 2, margin + 70, { align: 'center' });

    // Body: "This is to certify that"
    doc.setFontSize(14); // Reduced font size
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(55, 65, 81); // Gray-700
    doc.text('This is to certify that', pageWidth / 2, margin + 100, { align: 'center' });

    // Recipient Name
    doc.setFontSize(24); // Reduced font size
    doc.setFont('Times', 'italic');
    doc.setTextColor(30, 58, 138); // Blue-800
    doc.text(data?.user || 'Unknown User', pageWidth / 2, margin + 130, { align: 'center' });

    // Body: "has successfully completed the course"
    doc.setFontSize(14); // Reduced font size
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(55, 65, 81); // Gray-700
    doc.text('has successfully completed the course', pageWidth / 2, margin + 160, { align: 'center' });

    // Course Name
    doc.setFontSize(20); // Reduced font size
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(23, 37, 84); // Blue-900
    doc.text(data?.course?.title || 'Unknown Course', pageWidth / 2, margin + 190, { align: 'center' });

    // Date
    doc.setFontSize(12); // Reduced font size
    doc.setTextColor(75, 85, 99); // Gray-600
    doc.text(formattedDate, pageWidth / 2, margin + 220, { align: 'center' });

    // Footer Section (Instructor and Organization)
    const footerY = margin + 260; // Adjusted to fit within page
    doc.setFontSize(10); // Reduced font size
    doc.setTextColor(55, 65, 81);

    // Instructor
    doc.text('Instructor:', margin + 40, footerY);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(30, 58, 138); // Blue-800
    doc.text(data?.course?.instructorId?.username || 'Unknown Instructor', margin + 40, footerY + 12);

    // Organization
    doc.setFontSize(10); // Reduced font size
    doc.setTextColor(55, 65, 81); // Gray-700
    doc.setFont('Helvetica', 'normal');
    doc.text('Organization:', pageWidth - margin - 80, footerY);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(30, 58, 138); // Blue-800
    doc.text(organization, pageWidth - margin - 80, footerY + 12);

    // Download the PDF
    doc.save(`${data?.user || 'Certificate'}_Certificate.pdf`);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center py-10">
      <div className="relative max-w-4xl w-full mx-auto border-4 border-black p-8 bg-white text-center rounded-2xl shadow-2xl overflow-hidden">
        {/* Logo Placeholder */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-blue-900 tracking-wide">{organization}</h1>
        </div>

        {/* Certificate Title */}
        <h1 className="text-3xl md:text-4xl font-sans font-bold text-black mb-4 tracking-wider uppercase">
          Certificate of Completion
        </h1>

        <p className="text-md md:text-lg text-gray-700 mb-2 font-sans">This is to certify that</p>

        {/* Recipient Name */}
        <h2 className="text-2xl md:text-3xl font-semibold text-blue-800 mb-2 font-serif italic">
          {data?.user || 'Unknown User'}
        </h2>

        <p className="text-md md:text-lg text-gray-700 mb-2 font-sans">has successfully completed the course</p>

        {/* Course Name */}
        <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-4 font-sans uppercase">
          {data?.course?.title || 'Unknown Course'}
        </h3>

        {/* Date */}
        <p className="text-sm md:text-md text-gray-600 mb-6 font-sans">{formattedDate}</p>

        {/* Footer Section (Instructor and Organization) */}
        <div className="flex justify-between items-center mt-6 px-4">
          {/* Instructor */}
          <div className="text-left">
            <p className="text-xs font-medium text-gray-700">Instructor:</p>
            <p className="font-semibold text-blue-800 text-sm font-serif">
              {data?.course?.instructorId?.username || 'Unknown Instructor'}
            </p>
          </div>

          {/* Organization */}
          <div className="text-right">
            <p className="text-xs font-medium text-gray-700">Organization:</p>
            <p className="font-semibold text-blue-800 text-sm font-serif">{organization}</p>
          </div>
        </div>

        {/* Download Button (only in UI, not in PDF) */}
        <div className="mt-6">
          <button
            onClick={generatePDF}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificate;