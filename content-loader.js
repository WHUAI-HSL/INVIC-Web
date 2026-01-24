/**
 * Content loader - fixed version
 * Fix: Publications list black screen issue
 */

class ContentLoader {
    constructor(config) {
        this.config = config;
        this.cache = {};
        this.publicationsData = {};
        this.eventsData = {};
    }

    async loadMarkdown(filepath) {
        if (this.cache[filepath]) {
            return this.cache[filepath];
        }

        try {
            const response = await fetch(filepath);
            if (!response.ok) throw new Error(`Failed to load ${filepath}`);
            const text = await response.text();
            this.cache[filepath] = text;
            return text;
        } catch (error) {
            console.error('Error loading markdown:', error);
            return `# Load failed\nUnable to load file: ${filepath}`;
        }
    }

    async renderTeamInModal() {
        console.log('👥 Rendering team members...');
        
        const modal = document.getElementById('modal1');
        if (!modal) {
            console.warn('modal1 not found');
            return;
        }

        const members = this.config.team.members;
        if (!members || members.length === 0) {
            console.warn('No team member data');
            return;
        }

        let membersHtml = `
            <div style="margin-top: 40px;">
                <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 24px; color: white;">Team Members</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
        `;

        for (const member of members) {
            const bioContent = await this.loadMarkdown(member.bio);
            const bioPreview = this.extractBioPreview(bioContent);

            membersHtml += `
                <div class="stat-card" style="cursor: pointer; transition: all 0.3s;" 
                     onclick="showMemberDetail('${member.bio}')"
                     onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='rgba(41,151,255,0.5)';"
                     onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.1)';">
                    <div style="display: flex; align-items: flex-start; gap: 16px;">
                        <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 2px solid rgba(41,151,255,0.3);">
                            <img src="${member.avatar}" alt="${member.name}" 
                                 style="width: 100%; height: 100%; object-fit: cover;"
                                 onerror="this.src='data/team/avatars/default.svg'">
                        </div>
                        <div style="flex: 1; min-width: 0;">
                            <h4 style="font-size: 1.25rem; font-weight: bold; color: white; margin-bottom: 4px;">${member.name}</h4>
                            <p style="font-size: 0.875rem; color: #2997ff; margin-bottom: 4px;">${member.role}</p>
                            <p style="font-size: 0.75rem; color: #86868b; margin-bottom: 8px;">${member.school}</p>
                            <p style="font-size: 0.875rem; color: rgba(255,255,255,0.7); line-height: 1.4; 
                                      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; 
                                      overflow: hidden;">${bioPreview}</p>
                        </div>
                    </div>
                    <div style="margin-top: 12px; text-align: right;">
                        <span style="font-size: 0.75rem; color: #2997ff;">View details →</span>
                    </div>
                </div>
            `;
        }

        membersHtml += `
                </div>
            </div>
        `;

        const techStackSection = modal.querySelector('h3:last-of-type');
        if (techStackSection && techStackSection.parentElement) {
            const membersDiv = document.createElement('div');
            membersDiv.innerHTML = membersHtml;
            techStackSection.parentElement.insertBefore(membersDiv, techStackSection.parentElement.lastElementChild);
        }

        console.log(`  ✓ Loaded ${members.length} members`);
    }

    extractBioPreview(markdown) {
        const text = markdown
            .replace(/^#+ .+$/gm, '')
            .replace(/\*\*(.+?)\*\*/g, '$1')
            .replace(/\*(.+?)\*/g, '$1')
            .replace(/\[(.+?)\]\(.+?\)/g, '$1')
            .replace(/^[-*+] /gm, '')
            .replace(/\n+/g, ' ')
            .trim();
        
        return text.substring(0, 100) + (text.length > 100 ? '...' : '');
    }

    async renderPublications() {
        console.log('📄 Rendering publications...');
        
        const container = document.getElementById('publications-list');
        if (!container) {
            console.warn('publications-list not found');
            return;
        }

        const publications = this.config.publications;
        if (!publications || publications.length === 0) {
            container.innerHTML = '<div style="text-align: center; margin-top: 2.5rem; color: #86868b; font-size: 0.875rem;">No publications yet</div>';
            return;
        }

        let html = '';

        for (const pub of publications) {
            const content = await this.loadMarkdown(pub.file);
            const parsed = this.parsePublication(content);
            
            this.publicationsData[pub.file] = {
                ...parsed,
                year: pub.year,
                venue: pub.venue
            };

            // Use inline styles to ensure consistent rendering
            html += `
                <div class="reveal-item group" 
                     style="border-bottom: 1px solid rgba(255,255,255,0.1); 
                            padding: 2rem 1rem; 
                            cursor: pointer; 
                            transition: background-color 0.3s ease;
                            opacity: 1;"
                     onclick="window.showPublicationDetail('${pub.file}')"
                     onmouseover="this.style.backgroundColor='rgba(255,255,255,0.05)'"
                     onmouseout="this.style.backgroundColor='transparent'">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem;">
                        <div style="flex: 1;">
                            <p style="color: #2997ff; font-size: 0.875rem; font-weight: bold; margin-bottom: 0.5rem;">
                                ${pub.year} · ${pub.venue}
                            </p>
                            <h3 style="color: white; font-size: 1.5rem; font-weight: 500; margin-bottom: 0.75rem; transition: color 0.3s ease;"
                                onmouseover="this.style.color='#2997ff'"
                                onmouseout="this.style.color='white'">
                                ${parsed.title}
                            </h3>
                            ${parsed.authors ? `
                                <p style="color: #86868b; font-size: 0.875rem; margin-bottom: 0.75rem;">
                                    👥 ${parsed.authors}
                                </p>
                            ` : ''}
                            ${parsed.abstract ? `
                                <p style="color: #9ca3af; font-size: 0.875rem; line-height: 1.6; 
                                          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                                    ${parsed.abstract}
                                </p>
                            ` : ''}
                        </div>
                        <div style="flex-shrink: 0; display: flex; align-items: center;">
                            <span style="color: #86868b; font-size: 0.875rem; transition: color 0.3s ease;"
                                  class="read-more-text">
                                View details →
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
        
        // Add hover effect to "View details" text
        const readMoreTexts = container.querySelectorAll('.read-more-text');
        readMoreTexts.forEach(text => {
            text.parentElement.parentElement.parentElement.addEventListener('mouseenter', () => {
                text.style.color = 'white';
            });
            text.parentElement.parentElement.parentElement.addEventListener('mouseleave', () => {
                text.style.color = '#86868b';
            });
        });
        
        console.log(`  ✓ Loaded ${publications.length} publications`);
    }

    async renderEvents() {
        console.log('📅 Rendering events...');
        
        const container = document.getElementById('events-timeline');
        if (!container) {
            console.warn('events-timeline not found');
            return;
        }

        const events = this.config.events;
        if (!events || events.length === 0) {
            container.innerHTML = '<div style="color: #86868b; font-size: 0.875rem;">No events yet</div>';
            return;
        }

        let html = '';

        for (const event of events) {
            const content = await this.loadMarkdown(event.file);
            const parsed = this.parseEvent(content);

            this.eventsData[event.file] = {
                ...parsed,
                date: event.date,
                content
            };

            const highlightClass = event.highlight ? 'bg-apple-blue' : 'bg-neutral-700';

            html += `
                <div class="relative group cursor-pointer rounded-2xl px-4 py-3 transition-colors hover:bg-white/5"
                     onclick="window.showEventDetail('${event.file}')">
                    <span class="absolute -left-[49px] top-2 w-4 h-4 rounded-full ${highlightClass} ring-4 ring-black"></span>
                    <span class="text-apple-gray text-sm">${event.date}</span>
                    <h3 class="text-2xl text-white font-bold mt-1">${parsed.title}</h3>
                    <p class="text-gray-400 mt-2 max-w-xl">${parsed.description}</p>
                    <span class="text-apple-gray text-sm mt-3 inline-block transition-colors group-hover:text-white">View details →</span>
                </div>
            `;
        }

        container.innerHTML = html;
        console.log(`  ✓ Loaded ${events.length} events`);
    }

    async renderGallery() {
        console.log('🖼️  Rendering gallery...');
        
        const container = document.getElementById('gallery-grid');
        if (!container) {
            console.warn('gallery-grid not found');
            return;
        }

        const images = this.config.gallery.images;
        if (!images || images.length === 0) {
            container.innerHTML = '<div class="min-w-[300px] h-[400px] bg-neutral-800 rounded-2xl flex items-center justify-center text-gray-500 border border-white/10">No images yet</div>';
            return;
        }

        let html = '';

        for (const img of images) {
            html += `
                <div class="min-w-[300px] h-[400px] rounded-2xl overflow-hidden border border-white/10 cursor-pointer transition-all hover:scale-105 hover:border-apple-blue"
                     onclick="window.openImageModal('${img.src}', '${img.caption || ''}')">
                    <img src="${img.src}" alt="${img.caption || ''}" 
                         class="w-full h-full object-cover"
                         onerror="this.parentElement.innerHTML='<div class=\\'flex items-center justify-center h-full bg-neutral-800 text-gray-500\\'>Image failed to load</div>'">
                </div>
            `;
        }

        container.innerHTML = html;
        console.log(`  ✓ Loaded ${images.length} images`);
    }

    parsePublication(markdown) {
        const result = {
            title: '',
            authors: '',
            venue: '',
            abstract: '',
            content: markdown
        };

        const titleMatch = markdown.match(/^#\s+(.+)$/m);
        if (titleMatch) result.title = titleMatch[1];

        const authorsMatch = markdown.match(/\*\*Authors?:\*\*\s*(.+?)$/m);
        if (authorsMatch) result.authors = authorsMatch[1];

        const venueMatch = markdown.match(/\*\*Venue:\*\*\s*(.+?)$/m);
        if (venueMatch) result.venue = venueMatch[1];

        const abstractMatch = markdown.match(/\*\*Abstract:\*\*\s*\n(.+?)(?=\n##|\n\*\*|$)/s);
        if (abstractMatch) {
            result.abstract = abstractMatch[1].trim().substring(0, 200) + '...';
        }

        return result;
    }

    parseEvent(markdown) {
        const result = {
            title: '',
            description: ''
        };

        const titleMatch = markdown.match(/^#\s+(.+)$/m);
        if (titleMatch) result.title = titleMatch[1];

        const lines = markdown.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line && !line.startsWith('#') && !line.startsWith('**')) {
                result.description = line;
                break;
            }
        }

        return result;
    }

    async init() {
        console.log('🚀 Loading content...');
        try {
            await Promise.all([
                this.renderTeamInModal(),
                this.renderPublications(),
                this.renderEvents(),
                this.renderGallery()
            ]);
            console.log('✅ Content loaded');
        } catch (error) {
            console.error('❌ Content load failed:', error);
        }
    }

    getPublicationDetail(filepath) {
        return this.publicationsData[filepath];
    }

    getEventDetail(filepath) {
        return this.eventsData[filepath];
    }
}

let contentLoader = null;

window.showPublicationDetail = function(filepath) {
    if (!contentLoader) return;

    const data = contentLoader.getPublicationDetail(filepath);
    if (!data) return;

    let detailModal = document.getElementById('publication-detail-modal');
    let overlay = document.getElementById('modalOverlay');

    if (!detailModal) {
        detailModal = document.createElement('div');
        detailModal.id = 'publication-detail-modal';
        detailModal.className = 'card-modal';
        document.body.appendChild(detailModal);
    }

    const htmlContent = marked.parse(data.content);

    detailModal.innerHTML = `
        <div class="modal-close" onclick="closePublicationDetail()">✕</div>
        <div style="margin-bottom: 24px;">
            <div style="display: inline-block; padding: 6px 16px; background: rgba(41,151,255,0.1); 
                        border: 1px solid rgba(41,151,255,0.3); border-radius: 20px; margin-bottom: 16px;">
                <span style="color: #2997ff; font-weight: bold; font-size: 0.875rem;">${data.year} · ${data.venue}</span>
            </div>
            <h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 16px; color: white; line-height: 1.2;">
                ${data.title}
            </h2>
            ${data.authors ? `<p style="font-size: 1.125rem; color: #86868b; margin-bottom: 24px;">👥 ${data.authors}</p>` : ''}
        </div>
        
        <div class="markdown-content" style="color: rgba(255,255,255,0.9); line-height: 1.8; font-size: 1rem;">
            ${htmlContent}
        </div>
    `;

    detailModal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closePublicationDetail = function() {
    const detailModal = document.getElementById('publication-detail-modal');
    const overlay = document.getElementById('modalOverlay');
    
    if (detailModal) detailModal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
};

window.showEventDetail = function(filepath) {
    if (!contentLoader) return;

    const data = contentLoader.getEventDetail(filepath);
    if (!data) return;

    let detailModal = document.getElementById('event-detail-modal');
    let overlay = document.getElementById('modalOverlay');

    if (!detailModal) {
        detailModal = document.createElement('div');
        detailModal.id = 'event-detail-modal';
        detailModal.className = 'card-modal';
        document.body.appendChild(detailModal);
    }

    const htmlContent = marked.parse(data.content);

    detailModal.innerHTML = `
        <div class="modal-close" onclick="closeEventDetail()">✕</div>
        <div style="margin-bottom: 24px;">
            <div style="display: inline-block; padding: 6px 16px; background: rgba(41,151,255,0.1); 
                        border: 1px solid rgba(41,151,255,0.3); border-radius: 20px; margin-bottom: 16px;">
                <span style="color: #2997ff; font-weight: bold; font-size: 0.875rem;">${data.date}</span>
            </div>
            <h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 16px; color: white; line-height: 1.2;">
                ${data.title}
            </h2>
        </div>
        
        <div class="markdown-content" style="color: rgba(255,255,255,0.9); line-height: 1.8; font-size: 1rem;">
            ${htmlContent}
        </div>
    `;

    detailModal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeEventDetail = function() {
    const detailModal = document.getElementById('event-detail-modal');
    const overlay = document.getElementById('modalOverlay');

    if (detailModal) detailModal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
};

window.showMemberDetail = async function(bioFile) {
    if (!contentLoader) return;

    const content = await contentLoader.loadMarkdown(bioFile);
    const htmlContent = marked.parse(content);

    let memberModal = document.getElementById('member-detail-modal');
    let overlay = document.getElementById('modalOverlay');

    if (!memberModal) {
        memberModal = document.createElement('div');
        memberModal.id = 'member-detail-modal';
        memberModal.className = 'card-modal';
        document.body.appendChild(memberModal);
    }

    memberModal.innerHTML = `
        <div class="modal-close" onclick="closeMemberDetail()">✕</div>
        <div class="markdown-content" style="color: rgba(255,255,255,0.9); line-height: 1.8;">
            ${htmlContent}
        </div>
    `;

    memberModal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeMemberDetail = function() {
    const memberModal = document.getElementById('member-detail-modal');
    const overlay = document.getElementById('modalOverlay');
    
    if (memberModal) memberModal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
};

window.openImageModal = function(src, caption) {
    window.open(src, '_blank');
};

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof siteConfig !== 'undefined') {
        contentLoader = new ContentLoader(siteConfig);
        await contentLoader.init();
    } else {
        console.error('siteConfig is undefined. Make sure config.js is loaded.');
    }
});

document.addEventListener('click', function(e) {
    if (e.target.id === 'modalOverlay') {
        closePublicationDetail();
        closeEventDetail();
        closeMemberDetail();
    }
});
