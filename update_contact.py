import re

with open('src/components/SectionModal.tsx', 'r') as f:
    content = f.read()

start_idx = content.find('{section === \'contact\' && (')
end_idx = content.find('</div>\n      </div>\n    </div>')

if start_idx != -1 and end_idx != -1:
    new_contact = '''{section === 'contact' && (
            <div className="space-y-6">
              <div className="pb-2">
                <h2 className="font-mono-tech font-bold text-lg text-[#092A4A] dark:text-[#6EB5F7] flex items-center gap-2">
                  <span className="text-xl">📫</span> CONTACT
                </h2>
                <p className="font-mono-tech text-xs sm:text-sm text-[#4B6173] dark:text-[#94A3B8] mt-1">
                  Secure transmission channel. Open to new opportunities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div className="space-y-6">
                  <div className="bg-[#EADBC3]/30 dark:bg-[#151520]/30 p-5 rounded-xl border border-[#C8B79D] dark:border-[#2B3040]">
                    <div className="w-10 h-10 rounded-full bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] flex items-center justify-center mb-4 shadow-sm">
                      <Send size={18} />
                    </div>
                    <h3 className="font-display font-bold text-[#092A4A] dark:text-[#6EB5F7] text-lg mb-1">Direct Transmission</h3>
                    <p className="font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8] mb-4">
                      My inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                    </p>
                    
                    <div className="flex items-center justify-between bg-[#F4E9D5] dark:bg-[#0A0A0F] p-3 rounded-lg border border-[#C8B79D] dark:border-[#2B3040]">
                      <span className="font-mono-tech text-sm text-[#092A4A] dark:text-[#6EB5F7] font-semibold">{PERSONAL_INFO.socials.email}</span>
                      <button 
                        onClick={handleCopyEmail}
                        className="p-1.5 hover:bg-[#092A4A] dark:hover:bg-[#3B82F6] hover:text-[#F4E9D5] dark:hover:text-[#0A0A0F] rounded transition-colors text-[#4B6173] dark:text-[#94A3B8]"
                        title="Copy to clipboard"
                      >
                        {copiedEmail ? <CheckCircle2 size={16} className="text-[#6FAF75]" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <form onSubmit={handleSendTransmission} className="bg-[#EADBC3]/30 dark:bg-[#151520]/30 p-5 rounded-xl border border-[#C8B79D] dark:border-[#2B3040] space-y-4">
                  <div>
                    <label className="block font-mono-tech text-[10px] text-[#4B6173] dark:text-[#94A3B8] tracking-widest mb-1.5 uppercase">Sender Name</label>
                    <input 
                      type="text" 
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full font-mono-tech text-sm px-3.5 py-2.5 bg-[#F4E9D5] dark:bg-[#0A0A0F] border border-[#C8B79D] dark:border-[#2B3040] rounded-lg text-[#10283F] dark:text-[#E0E6ED] placeholder-[#4B6173]/50 focus:outline-none focus:border-[#092A4A] dark:focus:border-[#3B82F6] transition-colors"
                      placeholder="ENTER NAME"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-tech text-[10px] text-[#4B6173] dark:text-[#94A3B8] tracking-widest mb-1.5 uppercase">Return Address</label>
                    <input 
                      type="email" 
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full font-mono-tech text-sm px-3.5 py-2.5 bg-[#F4E9D5] dark:bg-[#0A0A0F] border border-[#C8B79D] dark:border-[#2B3040] rounded-lg text-[#10283F] dark:text-[#E0E6ED] placeholder-[#4B6173]/50 focus:outline-none focus:border-[#092A4A] dark:focus:border-[#3B82F6] transition-colors"
                      placeholder="ENTER EMAIL"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-tech text-[10px] text-[#4B6173] dark:text-[#94A3B8] tracking-widest mb-1.5 uppercase">Payload</label>
                    <textarea 
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      rows={4}
                      className="w-full font-mono-tech text-sm px-3.5 py-2.5 bg-[#F4E9D5] dark:bg-[#0A0A0F] border border-[#C8B79D] dark:border-[#2B3040] rounded-lg text-[#10283F] dark:text-[#E0E6ED] placeholder-[#4B6173]/50 focus:outline-none focus:border-[#092A4A] dark:focus:border-[#3B82F6] resize-none transition-colors"
                      placeholder="ENTER MESSAGE..."
                    />
                  </div>

                  {transmissionSuccess ? (
                    <div className="bg-[#6FAF75]/20 border border-[#6FAF75] rounded-lg p-3 text-center">
                      <span className="font-mono-tech text-xs text-[#6FAF75] font-bold">
                        TRANSMISSION {transmissionSuccess} SUCCESSFUL
                      </span>
                    </div>
                  ) : (
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-6 bg-[#092A4A] dark:bg-[#3B82F6] hover:bg-[#123F68] dark:hover:bg-[#2563EB] disabled:opacity-70 text-[#F4E9D5] dark:text-[#0A0A0F] font-mono-tech font-bold text-sm rounded-lg transition-transform shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <Send size={16} />
                      {isSubmitting ? 'TRANSMITTING...' : 'INITIALIZE UPLOAD'}
                    </button>
                  )}
                </form>
              </div>
            </div>
          )}
          '''
    content = content[:start_idx] + new_contact + content[end_idx:]
    with open('src/components/SectionModal.tsx', 'w') as f:
        f.write(content)
    print("Replaced Contact successfully")
else:
    print("Failed to find boundaries")
