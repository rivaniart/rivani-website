#!/usr/bin/env ruby
# Rivani Fine Art — Local Storefront & Studio Admin Server (Zero Dependencies)

require 'webrick'
require 'json'
require 'base64'
require 'fileutils'
require 'securerandom'
require 'time'

ROOT = File.expand_path(__dir__)
DATA_DIR = File.join(ROOT, 'data')
IMAGES_DIR = File.join(ROOT, 'assets', 'images')
ARTWORKS_JSON = File.join(DATA_DIR, 'artworks.json')
ARTWORKS_JS = File.join(DATA_DIR, 'artworks.js')
MUSE_JS = File.join(DATA_DIR, 'muse.js')
INQUIRIES_JSON = File.join(DATA_DIR, 'inquiries.json')
PORT = (ENV['PORT'] || 4173).to_i

FileUtils.mkdir_p(DATA_DIR)
FileUtils.mkdir_p(IMAGES_DIR)

MIME_TYPES = {
  '.html' => 'text/html; charset=utf-8',
  '.css' => 'text/css; charset=utf-8',
  '.js' => 'text/javascript; charset=utf-8',
  '.json' => 'application/json; charset=utf-8',
  '.png' => 'image/png',
  '.jpg' => 'image/jpeg',
  '.jpeg' => 'image/jpeg',
  '.webp' => 'image/webp',
  '.svg' => 'image/svg+xml',
  '.ico' => 'image/x-icon',
  '.mp3' => 'audio/mpeg',
  '.wav' => 'audio/wav',
  '.woff2' => 'font/woff2'
}.freeze

DATA_LOCK = Mutex.new

def load_artworks
  return [] unless File.exist?(ARTWORKS_JSON)

  JSON.parse(File.read(ARTWORKS_JSON, encoding: 'UTF-8'))
end

def save_artworks(artworks)
  pretty = JSON.pretty_generate(artworks)
  File.write(ARTWORKS_JSON, "#{pretty}\n", encoding: 'UTF-8')
  File.write(
    ARTWORKS_JS,
    "// Rivani Fine Art — Canonical Artworks Dataset\nwindow.RIVANI_ARTWORKS = #{pretty};\n",
    encoding: 'UTF-8'
  )
end

def load_muse
  return [] unless File.exist?(MUSE_JS)

  raw = File.read(MUSE_JS, encoding: 'UTF-8')
  json_part = raw.sub(/\A.*?window\.RIVANI_MUSE\s*=\s*/m, '').sub(/;\s*\z/m, '')
  JSON.parse(json_part)
rescue StandardError
  []
end

def save_muse(muse_items)
  pretty = JSON.pretty_generate(muse_items)
  File.write(
    MUSE_JS,
    "// Rivani Fine Art — Muse Series Dataset\nwindow.RIVANI_MUSE = #{pretty};\n",
    encoding: 'UTF-8'
  )
end

def load_inquiries
  return [] unless File.exist?(INQUIRIES_JSON)

  JSON.parse(File.read(INQUIRIES_JSON, encoding: 'UTF-8'))
rescue StandardError
  []
end

def save_inquiries(inquiries)
  File.write(INQUIRIES_JSON, "#{JSON.pretty_generate(inquiries)}\n", encoding: 'UTF-8')
end

def slugify(text)
  text.to_s.downcase.gsub(/[^a-z0-9]+/, '-').gsub(/\A-|-\z/, '')
end

def parse_price_inr(price_str, explicit_inr = nil)
  return explicit_inr.to_i if explicit_inr && explicit_inr.to_s.strip != ''

  digits = price_str.to_s.gsub(/[^\d]/, '')
  digits.empty? ? nil : digits.to_i
end

def format_inr(amount)
  return 'Price on Request' if amount.nil? || amount.to_i <= 0

  s = amount.to_i.to_s
  return "₹#{s}" if s.length <= 3

  last3 = s[-3, 3]
  rest = s[0...-3].reverse.gsub(/(\d{2})(?=\d)/, '\1,').reverse
  "₹#{rest},#{last3}"
end

def build_dimensions(body, existing = {})
  h_cm = body.key?('height_cm') ? (body['height_cm'].to_s.strip.empty? ? nil : body['height_cm'].to_i) : existing['height_cm']
  w_cm = body.key?('width_cm') ? (body['width_cm'].to_s.strip.empty? ? nil : body['width_cm'].to_i) : existing['width_cm']
  h_in = body.key?('height_in') && !body['height_in'].to_s.strip.empty? ? body['height_in'].to_i : (h_cm ? (h_cm / 2.54).round : existing['height_in'])
  w_in = body.key?('width_in') && !body['width_in'].to_s.strip.empty? ? body['width_in'].to_i : (w_cm ? (w_cm / 2.54).round : existing['width_in'])

  dim = body['dimensions'].to_s.strip
  if dim.empty? && h_cm && w_cm
    dim = "#{h_cm} × #{w_cm} cm (#{h_in} × #{w_in} in)"
  elsif dim.empty?
    dim = existing['dimensions'].to_s
  end

  [dim, h_cm, w_cm, h_in, w_in]
end

def normalize_artwork(body, existing = nil, artworks = [])
  base = existing ? existing.dup : {}
  new_id = base['id'] || ((artworks.map { |a| a['id'].to_i }.max || 0) + 1)
  new_canonical_id = base['canonical_id'] || ((artworks.map { |a| a['canonical_id'].to_i }.max || 0) + 1)

  title = (body['title'] || base['title'] || '').to_s.strip
  artist = (body['artist'] || base['artist'] || 'Rivani Atelier').to_s.strip
  artist = 'Rivani Atelier' if artist.empty?
  category = (body['category'] || base['category'] || 'Abstract').to_s.strip
  orientation = (body['orientation'] || base['orientation'] || 'Portrait').to_s.strip
  medium = (body['medium'] || base['medium'] || 'Oil on canvas').to_s.strip
  support = (body['support'] || base['support'] || '').to_s.strip
  if support.empty? && medium.downcase.include?(' on ')
    support = medium.split(/\bon\b/i, 2).last.strip
  end

  dimensions, h_cm, w_cm, h_in, w_in = build_dimensions(body, base)
  panel_count = (body['panel_count'] || base['panel_count'] || 1).to_i
  panel_count = 1 if panel_count < 1

  frame_type = (body.key?('frame_type') ? body['frame_type'] : base['frame_type']).to_s.strip
  frame_material = (body.key?('frame_material') ? body['frame_material'] : base['frame_material']).to_s.strip
  frame_colour = (body.key?('frame_colour') ? body['frame_colour'] : base['frame_colour']).to_s.strip
  frame_finish = (body.key?('frame_finish') ? body['frame_finish'] : base['frame_finish']).to_s.strip
  mount_liner = (body.key?('mount_liner') ? body['mount_liner'] : (base['mount_liner'] || 'None')).to_s.strip
  framed_dimensions = (body.key?('framed_dimensions') ? body['framed_dimensions'] : base['framed_dimensions']).to_s.strip

  framed_desc = (body.key?('framed_description') ? body['framed_description'] : base['framed_description']).to_s.strip
  if framed_desc.empty?
    parts = [frame_colour, frame_material, frame_type].reject(&:empty?)
    framed_desc = parts.join(' ')
  end

  raw_price = (body.key?('price') ? body['price'] : base['price']).to_s.strip
  price_inr = parse_price_inr(raw_price, body.key?('price_inr') ? body['price_inr'] : base['price_inr'])
  if raw_price.empty?
    raw_price = price_inr ? format_inr(price_inr) : 'Price on Request'
  elsif raw_price =~ /\A\d[\d,]*\z/
    raw_price = format_inr(price_inr)
  end

  views = if body['views'].is_a?(Array)
            body['views'].map { |v| v.to_s.strip }.reject(&:empty?).uniq
          else
            (base['views'] || []).dup
          end
  primary = (body['image'] || body['primary_image'] || base['image'] || views.first || '').to_s.strip
  if !primary.empty? && !views.include?(primary)
    views.unshift(primary)
  elsif primary.empty? && !views.empty?
    primary = views.first
  end

  status = (body['status'] || base['status'] || 'published').to_s.strip.downcase
  status = 'published' unless %w[published draft sold hidden].include?(status)

  slug = (body['slug'] || base['slug']).to_s.strip
  slug = slugify(title) if slug.empty?
  slug = "artwork-#{new_id}" if slug.empty?

  description = (body.key?('description') ? body['description'] : base['description']).to_s.strip
  notes = (body.key?('notes') ? body['notes'] : base['notes']).to_s.strip

  {
    'id' => new_id,
    'canonical_id' => new_canonical_id,
    'primary_card_id' => base['primary_card_id'] || new_id,
    'card_ids' => base['card_ids'] || [new_id],
    'title' => title,
    'canonical_title' => title,
    'source_title' => base['source_title'],
    'artist' => artist,
    'category' => category,
    'orientation' => orientation,
    'medium' => medium,
    'support' => support,
    'dimensions' => dimensions,
    'height_cm' => h_cm,
    'width_cm' => w_cm,
    'height_in' => h_in,
    'width_in' => w_in,
    'panel_count' => panel_count,
    'frame_type' => frame_type,
    'frame_material' => frame_material,
    'frame_colour' => frame_colour,
    'frame_finish' => frame_finish,
    'mount_liner' => mount_liner.empty? ? 'None' : mount_liner,
    'framed_description' => framed_desc,
    'framed_dimensions' => framed_dimensions,
    'price' => raw_price,
    'price_inr' => price_inr,
    'description' => description,
    'verification_status' => base['verification_status'] || 'verified',
    'duplicate_group' => base['duplicate_group'],
    'status' => status,
    'image' => primary,
    'primary_image' => primary,
    'views' => views,
    'notes' => notes,
    'slug' => slug,
    'updated_at' => Time.now.utc.iso8601
  }
end

def sync_muse_for_artwork(artwork, muse_config)
  return unless muse_config.is_a?(Hash)

  muse = load_muse
  enabled = muse_config['enabled'] == true
  muse_image = muse_config['image'].to_s.strip
  muse_image = artwork['image'] if muse_image.empty?

  if enabled && !muse_image.empty?
    existing_idx = muse.index { |m| m['artworkId'].to_i == artwork['id'].to_i && m['image'] == muse_image }
    if existing_idx
      muse[existing_idx]['title'] = artwork['title']
    else
      # Update first matching entry for this artwork if one exists and user changed image, else append
      first_idx = muse.index { |m| m['artworkId'].to_i == artwork['id'].to_i }
      entry = {
        'artworkId' => artwork['id'],
        'image' => muse_image,
        'title' => artwork['title']
      }
      if first_idx
        muse[first_idx] = entry
      else
        muse << entry
      end
    end
  elsif muse_config.key?('enabled') && !enabled
    muse.reject! { |m| m['artworkId'].to_i == artwork['id'].to_i }
  end

  save_muse(muse)
  muse
end

def json_response(res, status, payload)
  res.status = status
  res['Content-Type'] = 'application/json; charset=utf-8'
  res['Cache-Control'] = 'no-store'
  res.body = JSON.generate(payload)
end

def parse_json_body(req)
  return {} if req.body.nil? || req.body.strip.empty?

  JSON.parse(req.body.force_encoding('UTF-8'))
end

class ApiServlet < WEBrick::HTTPServlet::AbstractServlet
  def initialize(server, handler)
    super(server)
    @handler = handler
  end

  %w[GET POST PUT PATCH DELETE OPTIONS].each do |m|
    define_method("do_#{m}") { |req, res| @handler.call(req, res) }
  end
end

def mount_api(server, path, &block)
  server.mount(path, ApiServlet, block)
end

server = WEBrick::HTTPServer.new(
  Port: PORT,
  BindAddress: '127.0.0.1',
  Logger: WEBrick::Log.new($stderr, WEBrick::Log::INFO),
  AccessLog: [[$stderr, WEBrick::AccessLog::COMMON_LOG_FORMAT]]
)

# API: Metadata / presets for Admin UI
mount_api(server, '/api/meta') do |_req, res|
  DATA_LOCK.synchronize do
    artworks = load_artworks
    muse = load_muse
    inquiries = load_inquiries
    unique_vals = lambda do |field|
      artworks.map { |a| a[field].to_s.strip }.reject(&:empty?).uniq.sort
    end
    json_response(res, 200, {
      artists: unique_vals.call('artist'),
      categories: unique_vals.call('category'),
      orientations: unique_vals.call('orientation'),
      mediums: unique_vals.call('medium'),
      supports: unique_vals.call('support'),
      panelCounts: artworks.map { |a| a['panel_count'] }.compact.map(&:to_i).uniq.sort,
      frameTypes: unique_vals.call('frame_type'),
      frameMaterials: unique_vals.call('frame_material'),
      frameColours: unique_vals.call('frame_colour'),
      frameFinishes: unique_vals.call('frame_finish'),
      mountLiners: unique_vals.call('mount_liner'),
      counts: {
        artworks: artworks.length,
        published: artworks.count { |a| (a['status'] || 'published') == 'published' },
        draft: artworks.count { |a| a['status'] == 'draft' },
        sold: artworks.count { |a| a['status'] == 'sold' },
        muse: muse.length,
        inquiries: inquiries.length
      }
    })
  end
end

# API: Artworks collection + item endpoints
mount_api(server, '/api/artworks') do |req, res|
  path_suffix = req.path_info.to_s.sub(%r{\A/}, '')
  DATA_LOCK.synchronize do
    artworks = load_artworks

    if path_suffix.empty?
      case req.request_method
      when 'GET'
        next json_response(res, 200, { artworks: artworks })
      when 'POST'
        body = parse_json_body(req)
        return json_response(res, 400, { error: 'Title is required.' }) if body['title'].to_s.strip.empty?

        artwork = normalize_artwork(body, nil, artworks)
        return json_response(res, 400, { error: 'At least one artwork image is required.' }) if artwork['image'].empty?

        artworks.unshift(artwork)
        save_artworks(artworks)
        muse = sync_muse_for_artwork(artwork, body['muse']) if body['muse'].is_a?(Hash)
        next json_response(res, 201, { artwork: artwork, artworks: artworks, muse: muse || load_muse })
      else
        next json_response(res, 405, { error: 'Method not allowed' })
      end
    else
      target_id = path_suffix.to_i
      idx = artworks.index { |a| a['id'].to_i == target_id }
      return json_response(res, 404, { error: "Artwork #{target_id} not found" }) unless idx

      case req.request_method
      when 'GET'
        next json_response(res, 200, { artwork: artworks[idx] })
      when 'PUT', 'PATCH'
        body = parse_json_body(req)
        return json_response(res, 400, { error: 'Title is required.' }) if body.key?('title') && body['title'].to_s.strip.empty?

        updated = normalize_artwork(body, artworks[idx], artworks)
        artworks[idx] = updated
        save_artworks(artworks)
        muse = body['muse'].is_a?(Hash) ? sync_muse_for_artwork(updated, body['muse']) : load_muse
        # Ensure existing Muse titles stay synced when artwork title changes
        unless body['muse'].is_a?(Hash)
          changed = false
          muse.each do |m|
            if m['artworkId'].to_i == updated['id'].to_i && m['title'] != updated['title']
              m['title'] = updated['title']
              changed = true
            end
          end
          save_muse(muse) if changed
        end
        next json_response(res, 200, { artwork: updated, artworks: artworks, muse: muse })
      when 'DELETE'
        removed = artworks.delete_at(idx)
        save_artworks(artworks)
        muse = load_muse.reject { |m| m['artworkId'].to_i == removed['id'].to_i }
        save_muse(muse)
        next json_response(res, 200, { deletedId: removed['id'], artworks: artworks, muse: muse })
      else
        next json_response(res, 405, { error: 'Method not allowed' })
      end
    end
  end
rescue JSON::ParserError
  json_response(res, 400, { error: 'Invalid JSON request body' })
end

# API: Muse Series management
mount_api(server, '/api/muse') do |req, res|
  DATA_LOCK.synchronize do
    muse = load_muse
    case req.request_method
    when 'GET'
      json_response(res, 200, { muse: muse })
    when 'PUT'
      body = parse_json_body(req)
      items = body['muse']
      return json_response(res, 400, { error: 'Expected muse array' }) unless items.is_a?(Array)

      artworks = load_artworks.each_with_object({}) { |a, h| h[a['id'].to_i] = a }
      cleaned = items.map do |item|
        aid = item['artworkId'].to_i
        art = artworks[aid]
        img = item['image'].to_s.strip
        next nil if img.empty? || !art

        {
          'artworkId' => aid,
          'image' => img,
          'title' => (item['title'].to_s.strip.empty? ? art['title'] : item['title'].to_s.strip)
        }
      end.compact
      save_muse(cleaned)
      json_response(res, 200, { muse: cleaned })
    when 'POST'
      body = parse_json_body(req)
      aid = body['artworkId'].to_i
      img = body['image'].to_s.strip
      art = load_artworks.find { |a| a['id'].to_i == aid }
      return json_response(res, 400, { error: 'Valid artwork and image are required' }) if art.nil? || img.empty?

      entry = { 'artworkId' => aid, 'image' => img, 'title' => art['title'] }
      muse.unshift(entry)
      save_muse(muse)
      json_response(res, 201, { entry: entry, muse: muse })
    else
      json_response(res, 405, { error: 'Method not allowed' })
    end
  end
rescue JSON::ParserError
  json_response(res, 400, { error: 'Invalid JSON request body' })
end

# API: Image upload (JSON base64 data URL -> assets/images/)
mount_api(server, '/api/upload') do |req, res|
  return json_response(res, 405, { error: 'Method not allowed' }) unless req.request_method == 'POST'

  begin
    body = parse_json_body(req)
    data_url = body['dataUrl'].to_s
    orig_name = body['filename'].to_s

    match = data_url.match(%r{\Adata:image/(jpeg|jpg|png|webp);base64,(.+)\z}im)
    return json_response(res, 400, { error: 'Unsupported image format. Use JPG, PNG, or WEBP.' }) unless match

    ext = match[1].downcase
    ext = 'jpg' if ext == 'jpeg'
    raw_bytes = Base64.decode64(match[2])
    return json_response(res, 400, { error: 'Empty image payload.' }) if raw_bytes.empty?
    return json_response(res, 413, { error: 'Image exceeds 25 MB limit.' }) if raw_bytes.bytesize > 25 * 1024 * 1024

    base = slugify(File.basename(orig_name, File.extname(orig_name)))
    base = 'artwork' if base.empty?
    filename = "#{base}-#{Time.now.to_i}-#{SecureRandom.hex(3)}.#{ext}"
    dest = File.join(IMAGES_DIR, filename)
    File.binwrite(dest, raw_bytes)

    json_response(res, 201, {
      ok: true,
      path: "assets/images/#{filename}",
      filename: filename,
      bytes: raw_bytes.bytesize
    })
  rescue JSON::ParserError
    json_response(res, 400, { error: 'Invalid JSON upload body' })
  end
end

# API: Acquisition Inquiries Inbox
mount_api(server, '/api/inquiries') do |req, res|
  path_suffix = req.path_info.to_s.sub(%r{\A/}, '')
  DATA_LOCK.synchronize do
    inquiries = load_inquiries
    case req.request_method
    when 'GET'
      json_response(res, 200, { inquiries: inquiries })
    when 'POST'
      body = parse_json_body(req)
      return json_response(res, 400, { error: 'Name and phone are required' }) if body['name'].to_s.strip.empty? || body['phone'].to_s.strip.empty?

      entry = {
        'id' => SecureRandom.hex(6),
        'name' => body['name'].to_s.strip,
        'phone' => body['phone'].to_s.strip,
        'email' => body['email'].to_s.strip,
        'city' => body['city'].to_s.strip,
        'message' => body['message'].to_s.strip,
        'works' => body['works'].is_a?(Array) ? body['works'] : [],
        'status' => 'New',
        'created_at' => Time.now.utc.iso8601
      }
      inquiries.unshift(entry)
      save_inquiries(inquiries)
      json_response(res, 201, { ok: true, inquiry: entry })
    when 'PATCH'
      idx = inquiries.index { |i| i['id'] == path_suffix }
      return json_response(res, 404, { error: 'Inquiry not found' }) unless idx

      body = parse_json_body(req)
      inquiries[idx]['status'] = body['status'].to_s unless body['status'].to_s.strip.empty?
      save_inquiries(inquiries)
      json_response(res, 200, { inquiry: inquiries[idx], inquiries: inquiries })
    else
      json_response(res, 405, { error: 'Method not allowed' })
    end
  end
rescue JSON::ParserError
  json_response(res, 400, { error: 'Invalid JSON request body' })
end

# Static files (/ -> index.html, /admin -> admin/index.html)
server.mount_proc '/' do |req, res|
  req_path = WEBrick::HTTPUtils.unescape(req.path || '/')
  req_path = '/index.html' if req_path == '/'
  req_path = '/admin/index.html' if req_path == '/admin' || req_path == '/admin/'

  rel = req_path.sub(%r{\A/+}, '')
  full = File.expand_path(File.join(ROOT, rel))

  if full != ROOT && !full.start_with?(ROOT + File::SEPARATOR)
    res.status = 403
    res.body = 'Forbidden'
    next
  end

  if File.directory?(full)
    candidate = File.join(full, 'index.html')
    full = candidate if File.file?(candidate)
  end

  unless File.file?(full)
    res.status = 404
    res.body = 'Not found'
    next
  end

  ext = File.extname(full).downcase
  res.status = 200
  res['Content-Type'] = MIME_TYPES[ext] || 'application/octet-stream'
  if full.start_with?(DATA_DIR + File::SEPARATOR) || ext == '.html'
    res['Cache-Control'] = 'no-store'
  end
  res.body = File.binread(full)
end

trap('INT') { server.shutdown }
trap('TERM') { server.shutdown }

puts "Rivani Fine Art storefront: http://localhost:#{PORT}/"
puts "Rivani Studio admin:        http://localhost:#{PORT}/admin"
server.start
