"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ExternalLink,
  Download,
  Users,
  MessageCircle,
  ArrowLeft,
  Check,
  X,
  Building2,
  FileText,
  TableProperties,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
}

export default function ContactParser() {
  const [inputText, setInputText] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentStep, setCurrentStep] = useState<"input" | "table">("input");

  // Get current date in DD/MM/YY format
  const getCurrentDatePrefix = (): string => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Format Indonesian phone number
  const formatIndonesianPhoneNumber = (phoneNumber: string): string => {
    // Remove any non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, "");

    // If starts with 0, replace with 62
    if (cleanNumber.startsWith("0")) {
      return "62" + cleanNumber.substring(1);
    }

    // If starts with 8, add 62
    if (cleanNumber.startsWith("8")) {
      return "62" + cleanNumber;
    }

    // Otherwise return as is
    return cleanNumber;
  };

  const parseContacts = () => {
    if (!inputText.trim()) return;

    const lines = inputText
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
    const parsedContacts: Contact[] = [];
    const datePrefix = getCurrentDatePrefix();

    // Process every 2 lines as one contact (name, then phone number)
    for (let i = 0; i < lines.length; i += 2) {
      const originalName = lines[i];
      const phoneNumber = lines[i + 1];

      if (originalName && phoneNumber) {
        // Add date prefix and "Ns" to the name
        const formattedName = `${datePrefix} Ns ${originalName.trim()}`;

        parsedContacts.push({
          id: `contact-${i}-${Date.now()}`,
          name: formattedName,
          phoneNumber: formatIndonesianPhoneNumber(phoneNumber.trim()),
        });
      }
    }

    setContacts(parsedContacts);
    setCurrentStep("table");
  };

  const updateContact = (
    id: string,
    field: "name" | "phoneNumber",
    value: string
  ) => {
    setContacts((prev) =>
      prev.map((contact) => {
        if (contact.id === id) {
          if (field === "phoneNumber") {
            return { ...contact, [field]: formatIndonesianPhoneNumber(value) };
          }
          return { ...contact, [field]: value };
        }
        return contact;
      })
    );
  };

  const openWhatsApp = (phoneNumber: string) => {
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, "");

    // Template message
    const message = `Salam kenal ya Pak Aku Khaeril  dari PT Rifan Jakarta

Khaeril mau sharing bisnis di komoditi Pak , perusahaan Khaeril udah Legal ya

Ini sekilas penjelasan beberapa aspek , Disini tertera mulai dari Legalitas Perusahaan dan Lembaga Penjaminnya Bapak ketika nantinya Bapak gabung investasi di PT Rifan yaa Pak 😊


Ada yg mau d tanyain Pak terlebih dahulu ?`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const exportToVCF = () => {
    if (contacts.length === 0) return;

    let vcfContent = "";

    contacts.forEach((contact) => {
      vcfContent += `BEGIN:VCARD\n`;
      vcfContent += `VERSION:3.0\n`;
      vcfContent += `FN:${contact.name}\n`;
      vcfContent += `TEL:+${contact.phoneNumber}\n`;
      vcfContent += `END:VCARD\n\n`;
    });

    const blob = new Blob([vcfContent], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "contacts.vcf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInputText("");
    setContacts([]);
    setCurrentStep("input");
  };

  const goBackToInput = () => {
    setCurrentStep("input");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Company Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-4 mb-2 px-0">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Building2 className="h-8 w-8 text-blue-100" />
            </div>
            <div className="text-center">
              <h1 className="md:text-4xl font-bold bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                PT Rifan Financindo Berjangka
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mx-auto mt-2"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* App Header */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Pemeriksa Kontak
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Tempel data kontak dari Google Lens, ubah menjadi tabel, dan ekspor
            sebagai file VCF.
          </p>

          {/* Penunjuk Langkah yang Ditingkatkan */}
          <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
            {/* Langkah 1 */}
            <div className="flex items-center">
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep === "input"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {currentStep === "input" ? (
                    <FileText className="h-5 w-5" />
                  ) : (
                    <Check className="h-5 w-5" />
                  )}
                </div>
                {currentStep === "input" && (
                  <div className="absolute -inset-1 bg-blue-600 rounded-full animate-ping opacity-20"></div>
                )}
              </div>
              <div className="ml-3 text-left">
                <div
                  className={`font-medium ${
                    currentStep === "input" ? "text-blue-600" : "text-green-600"
                  }`}
                >
                  Masukkan Data
                </div>
                <div className="text-sm text-gray-500">Tempel data kontak</div>
              </div>
            </div>

            {/* Penghubung */}
            <div className="flex-1 h-0.5 mx-4">
              <div
                className={`h-full transition-all duration-500 ${
                  currentStep === "table" ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
            </div>

            {/* Langkah 2 */}
            <div className="flex items-center">
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep === "table"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  <TableProperties className="h-5 w-5" />
                </div>
                {currentStep === "table" && (
                  <div className="absolute -inset-1 bg-blue-600 rounded-full animate-ping opacity-20"></div>
                )}
              </div>
              <div className="ml-3 text-left">
                <div
                  className={`font-medium ${
                    currentStep === "table" ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  Tinjau & Ekspor
                </div>
                <div className="text-sm text-gray-500">Edit dan unduh</div>
              </div>
            </div>
          </div>
        </div>

        {currentStep === "input" ? (
          /* Input Section */
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <ExternalLink className="h-5 w-5" />
                Paste Contact Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <Textarea
                placeholder="Paste your contact data here...&#10;&#10;Example:&#10;KHAERIL MASWAL ZAID&#10;082343652494&#10;MUHAMMAD REZKY EFENDI&#10;628912345678"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-64 resize-none border-2 border-gray-200 focus:border-blue-500 transition-colors"
              />
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 bg-gray-50 rounded-b-lg">
              <Button
                onClick={parseContacts}
                disabled={!inputText.trim()}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 shadow-lg"
              >
                Parse Contacts
              </Button>
              <Button
                variant="outline"
                onClick={clearAll}
                className="flex-1 sm:flex-none"
              >
                Clear
              </Button>
            </CardFooter>
          </Card>
        ) : (
          /* Results Section */
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <Users className="h-5 w-5" />
                  Parsed Contacts ({contacts.length})
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={goBackToInput}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Input
                  </Button>
                  <Button
                    onClick={exportToVCF}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Download className="h-4 w-4" />
                    Export VCF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="min-w-48 font-semibold">
                        Name
                      </TableHead>
                      <TableHead className="min-w-40 font-semibold">
                        Phone Number
                      </TableHead>
                      <TableHead className="w-32 font-semibold">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact, index) => (
                      <TableRow
                        key={contact.id}
                        className={
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }
                      >
                        <TableCell>
                          <Input
                            value={contact.name}
                            onChange={(e) =>
                              updateContact(contact.id, "name", e.target.value)
                            }
                            className="border-0 bg-transparent p-2 focus:bg-white focus:border focus:border-blue-300 focus:shadow-sm transition-all"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input
                              value={contact.phoneNumber}
                              onChange={(e) =>
                                updateContact(
                                  contact.id,
                                  "phoneNumber",
                                  e.target.value
                                )
                              }
                              className="border-0 bg-transparent p-2 focus:bg-white focus:border focus:border-blue-300 focus:shadow-sm transition-all"
                            />
                            {contact.phoneNumber.startsWith("62") ? (
                              <div className="flex items-center gap-1">
                                <Check className="h-4 w-4 text-green-500" />
                                <span className="text-xs text-green-600 hidden sm:inline">
                                  Valid
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <X className="h-4 w-4 text-red-500" />
                                <span className="text-xs text-red-600 hidden sm:inline">
                                  Invalid
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openWhatsApp(contact.phoneNumber)}
                            className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 hover:border-green-300 transition-all"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-gray-50 rounded-b-lg">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                {contacts.length} kontak siap untuk diekspor
              </p>
              <Button
                onClick={exportToVCF}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4" />
                Export VCF
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Cara penggunaan:
            </h3>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
              <li>
                Salin data kontak dari Google Lens (format: Nama di baris
                pertama, Nomor telepon di baris kedua)
              </li>
              <li>Tempel data ke dalam textarea</li>
              <li>
                Klik "Parse Kontak" untuk mengubah menjadi tabel yang dapat
                diedit
              </li>
              <li>Tinjau dan edit nama serta nomor telepon jika diperlukan</li>
              <li>
                Klik tombol WhatsApp untuk membuka chat dengan pesan yang sudah
                terisi
              </li>
              <li>
                Klik "Ekspor VCF" untuk mengunduh kontak sebagai file .vcf
              </li>
            </ol>
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Fitur Otomatis:
              </h4>
              <p className="text-sm text-blue-800">
                • Nama kontak akan ditambahkan awalan tanggal hari ini + "Ns"
                <br />• Nomor telepon akan otomatis diformat ke format Indonesia
                (62)
                <br />• WhatsApp akan terbuka dengan template pesan bisnis dari
                PT Rifan
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
