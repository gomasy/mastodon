# frozen_string_literal: true

module MarkdownHelper
  class CustomRender < Redcarpet::Render::HTML
    include ERB::Util

    def block_code(code, language)
      "<pre#{@options[:prettyprint] ? ' class="prettyprint"' : ''}>" \
        "<code>#{html_escape(strip_tags(code))}</code>" \
      "</pre>"
    end

    def codespan(code)
      "<code>#{html_escape(strip_tags(code))}</code>"
    end

    def autolink(link, link_type)
      return link if link_type == :email

      TextFormatter.shortened_link(link)
    end

    def strip_tags(code)
      code
        .gsub(/<a[^>]*rel="tag"[^>]*>(.*?)<\/a>/, '\1')
        .gsub(/#<span>(.*?)<\/span>/, '#\1')
        .gsub(/<span.*?class="h-card".*?><a.*?class=".*?u-url.*?">(.*?)<\/a><\/span>/, '\1')
        .gsub(/@<span>(.*?)<\/span>/, '@\1')
    end
  end

  def renderer_options
    {
      no_images: true,
      no_styles: true,
      safe_links_only: true,
      xhtml: true,
      link_attributes: {
        target: "_blank",
        rel: "nofollow noopener noreferrer",
        translate: "no",
        class: "status-link unhandled-link",
      },
    }
  end

  def renderer_extensions
    {
      no_intra_emphasis: true,
      fenced_code_blocks: true,
      autolink: true,
      disable_indented_code_blocks: true,
      strikethrough: true,
      space_after_headers: true,
      underline: true,
      highlight: true,
    }
  end

  def unescape(text)
    text
      .gsub("&amp;", "&")
      .gsub("&lt;", "<")
      .gsub("&gt;", ">")
      .gsub("&quot;", "\"")
      .gsub("&#39;", "'")
  end

  def parse_markdown(text)
    markdown = Redcarpet::Markdown.new(CustomRender.new(renderer_options), renderer_extensions)
    markdown.render(unescape(text))
  end
end
