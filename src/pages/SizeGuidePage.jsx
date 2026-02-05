import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Ruler,
  Printer,
  Download,
  ChevronDown,
  ChevronUp,
  Info,
  Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FadeInOnScroll } from '@/components/ui';

// Ring size conversion data
const ringSizes = [
  { us: '3', uk: 'F', eu: '44', diameter: '14.1mm', circumference: '44.2mm' },
  { us: '3.5', uk: 'G', eu: '45', diameter: '14.4mm', circumference: '45.5mm' },
  { us: '4', uk: 'H', eu: '47', diameter: '14.9mm', circumference: '46.8mm' },
  { us: '4.5', uk: 'I', eu: '48', diameter: '15.3mm', circumference: '48.0mm' },
  { us: '5', uk: 'J', eu: '49', diameter: '15.7mm', circumference: '49.3mm' },
  { us: '5.5', uk: 'K', eu: '51', diameter: '16.1mm', circumference: '50.6mm' },
  { us: '6', uk: 'L', eu: '52', diameter: '16.5mm', circumference: '51.9mm' },
  { us: '6.5', uk: 'M', eu: '53', diameter: '16.9mm', circumference: '53.1mm' },
  { us: '7', uk: 'N', eu: '54', diameter: '17.3mm', circumference: '54.4mm' },
  { us: '7.5', uk: 'O', eu: '56', diameter: '17.7mm', circumference: '55.7mm' },
  { us: '8', uk: 'P', eu: '57', diameter: '18.1mm', circumference: '57.0mm' },
  { us: '8.5', uk: 'Q', eu: '58', diameter: '18.5mm', circumference: '58.3mm' },
  { us: '9', uk: 'R', eu: '60', diameter: '19.0mm', circumference: '59.5mm' },
  { us: '9.5', uk: 'S', eu: '61', diameter: '19.4mm', circumference: '60.8mm' },
  { us: '10', uk: 'T', eu: '62', diameter: '19.8mm', circumference: '62.1mm' },
  { us: '10.5', uk: 'U', eu: '64', diameter: '20.2mm', circumference: '63.4mm' },
  { us: '11', uk: 'V', eu: '65', diameter: '20.6mm', circumference: '64.6mm' },
  { us: '11.5', uk: 'W', eu: '66', diameter: '21.0mm', circumference: '65.9mm' },
  { us: '12', uk: 'X', eu: '68', diameter: '21.4mm', circumference: '67.2mm' },
];

// Bracelet sizes
const braceletSizes = [
  { size: 'XS', wrist: '5.5" - 6"', length: '6.5"', description: 'Extra Small' },
  { size: 'S', wrist: '6" - 6.5"', length: '7"', description: 'Small' },
  { size: 'M', wrist: '6.5" - 7"', length: '7.5"', description: 'Medium' },
  { size: 'L', wrist: '7" - 7.5"', length: '8"', description: 'Large' },
  { size: 'XL', wrist: '7.5" - 8"', length: '8.5"', description: 'Extra Large' },
];

// Necklace lengths
const necklaceLengths = [
  { length: '14"', name: 'Choker', position: 'At the base of the neck' },
  { length: '16"', name: 'Collar', position: 'Rests at the collarbone' },
  { length: '18"', name: 'Princess', position: 'Rests at or just below the collarbone' },
  { length: '20"', name: 'Matinee', position: 'Falls a few inches below the collarbone' },
  { length: '24"', name: 'Opera', position: 'Falls below the bust line' },
  { length: '30"', name: 'Rope', position: 'Falls at or below the belly button' },
];

function SizeGuidePage() {
  const [expandedSection, setExpandedSection] = useState('rings');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const printRingSizer = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <FadeInOnScroll>
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Jewelry Size Guide
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find your perfect fit with our comprehensive sizing guide for rings,
              bracelets, and necklaces.
            </p>
          </div>
        </FadeInOnScroll>

        {/* Ring Size Guide */}
        <FadeInOnScroll>
          <Card className="mb-6 overflow-hidden">
            <button
              onClick={() => toggleSection('rings')}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Circle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Ring Size Guide</h2>
                  <p className="text-sm text-gray-600">
                    International size conversion chart
                  </p>
                </div>
              </div>
              {expandedSection === 'rings' ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {expandedSection === 'rings' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t"
              >
                <div className="p-6 space-y-6">
                  {/* How to Measure */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-2">
                          How to Measure Your Ring Size
                        </h3>
                        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                          <li>Wrap a string or paper around the base of your finger</li>
                          <li>Mark where the ends meet with a pen</li>
                          <li>Measure the string/paper with a ruler (in mm)</li>
                          <li>Use the circumference to find your size in the table below</li>
                          <li>
                            Or print our ring sizer below for accurate measurement
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* Print Ring Sizer Button */}
                  <div className="flex gap-3">
                    <Button onClick={printRingSizer} leftIcon={<Printer className="h-4 w-4" />}>
                      Print Ring Sizer
                    </Button>
                    <Button
                      variant="outline"
                      leftIcon={<Download className="h-4 w-4" />}
                      onClick={() => window.open('/ring-sizer.pdf', '_blank')}
                    >
                      Download PDF
                    </Button>
                  </div>

                  {/* Size Conversion Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            US Size
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            UK Size
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            EU Size
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Diameter
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Circumference
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {ringSizes.map((size) => (
                          <tr key={size.us} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {size.us}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{size.uk}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{size.eu}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {size.diameter}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {size.circumference}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Tips */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-900 mb-2">Sizing Tips</h4>
                    <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                      <li>Measure at the end of the day when fingers are largest</li>
                      <li>Consider the width of the band (wider bands fit more snugly)</li>
                      <li>Your dominant hand may be slightly larger</li>
                      <li>If between sizes, choose the larger size</li>
                      <li>
                        Temperature affects finger size - measure in room temperature
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        </FadeInOnScroll>

        {/* Bracelet Size Guide */}
        <FadeInOnScroll>
          <Card className="mb-6 overflow-hidden">
            <button
              onClick={() => toggleSection('bracelets')}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Ruler className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Bracelet Size Guide
                  </h2>
                  <p className="text-sm text-gray-600">Find your wrist size</p>
                </div>
              </div>
              {expandedSection === 'bracelets' ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {expandedSection === 'bracelets' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t"
              >
                <div className="p-6 space-y-6">
                  {/* How to Measure */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-2">
                          How to Measure Your Wrist
                        </h3>
                        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                          <li>Wrap a measuring tape around your wrist</li>
                          <li>Mark where the tape meets (just below the wrist bone)</li>
                          <li>Note the measurement in inches</li>
                          <li>Add 0.5" - 1" for comfortable fit</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* Size Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Size
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Wrist Circumference
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Bracelet Length
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {braceletSizes.map((size) => (
                          <tr key={size.size} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {size.size}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {size.wrist}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {size.length}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {size.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        </FadeInOnScroll>

        {/* Necklace Length Guide */}
        <FadeInOnScroll>
          <Card className="mb-6 overflow-hidden">
            <button
              onClick={() => toggleSection('necklaces')}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Circle className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Necklace Length Guide
                  </h2>
                  <p className="text-sm text-gray-600">Choose the perfect length</p>
                </div>
              </div>
              {expandedSection === 'necklaces' ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {expandedSection === 'necklaces' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t"
              >
                <div className="p-6 space-y-6">
                  {/* Visual Guide */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {necklaceLengths.map((item) => (
                      <div
                        key={item.length}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
                          <span className="font-bold text-gray-900">{item.length}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.position}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tips */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-900 mb-2">
                      Choosing Your Length
                    </h4>
                    <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                      <li>16" and 18" are most popular for everyday wear</li>
                      <li>Consider neckline of clothing when choosing</li>
                      <li>Layering? Choose different lengths (2" apart minimum)</li>
                      <li>Pendants add 1-2" to the drop length</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        </FadeInOnScroll>

        {/* Help Section */}
        <FadeInOnScroll>
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Still Need Help?
              </h3>
              <p className="text-gray-600 mb-6">
                Our jewelry experts are here to help you find the perfect size
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button>Contact Us</Button>
                <Button variant="outline">Live Chat</Button>
              </div>
            </div>
          </Card>
        </FadeInOnScroll>
      </div>

      {/* Printable Ring Sizer (hidden, for printing) */}
      <div className="print-only fixed inset-0 bg-white p-8" style={{ display: 'none' }}>
        <style>
          {`
            @media print {
              .print-only {
                display: block !important;
              }
              body * {
                visibility: hidden;
              }
              .print-only, .print-only * {
                visibility: visible;
              }
            }
          `}
        </style>
        <h1 className="text-2xl font-bold mb-4">Almira Ring Sizer</h1>
        <p className="mb-4">
          Cut along the dotted line and wrap around your finger. Mark where it meets.
        </p>
        <div className="border-2 border-dashed border-gray-400 p-4">
          {ringSizes.map((size) => (
            <div key={size.us} className="border-b border-gray-300 py-2">
              <span className="font-bold">US {size.us}</span> - {size.circumference}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SizeGuidePage;
