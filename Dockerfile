# syntax=docker/dockerfile:1.7
ARG RUBY_VERSION="3.3.3"
ARG NODE_MAJOR_VERSION="20"
ARG DEBIAN_VERSION="bookworm"

FROM docker.io/ruby:${RUBY_VERSION}-slim-${DEBIAN_VERSION} as ruby
RUN rm -fr /usr/local/lib/ruby/gems/*/cache

FROM docker.io/node:${NODE_MAJOR_VERSION}-${DEBIAN_VERSION}-slim as build

COPY --link --from=ruby /usr/local/bin/ /usr/local/bin/
COPY --link --from=ruby /usr/local/include/ /usr/local/include/
COPY --link --from=ruby /usr/local/lib/ /usr/local/lib/

ENV DEBIAN_FRONTEND="noninteractive"

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

WORKDIR /opt/mastodon

# hadolint ignore=DL3008
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        ca-certificates \
        git \
        libgdbm-dev \
        libgmp-dev \
        libicu-dev \
        libidn-dev \
        libjemalloc-dev \
        libpq-dev \
        libreadline8 \
        libssl-dev \
        libyaml-dev \
        python3 \
        shared-mime-info \
        zlib1g-dev && \
    bundle config set --local deployment 'true' && \
    bundle config set --local without 'development test' && \
    bundle config set silence_root_warning true && \
    corepack enable

COPY Gemfile* package.json yarn.lock .yarnrc.yml /opt/mastodon/
COPY streaming/package.json /opt/mastodon/streaming/
COPY .yarn /opt/mastodon/.yarn

RUN bundle install -j"$(nproc)"

RUN yarn workspaces focus --all --production && \
    yarn cache clean

FROM docker.io/node:${NODE_MAJOR_VERSION}-${DEBIAN_VERSION}-slim
RUN rm -fr /usr/local/include/*

# Use those args to specify your own version flags & suffixes
ARG MASTODON_VERSION_PRERELEASE=""
ARG MASTODON_VERSION_METADATA=""

ARG UID="991"
ARG GID="991"

COPY --link --from=ruby /usr/local/bin/ /usr/local/bin/
COPY --link --from=ruby /usr/local/lib/ /usr/local/lib/

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ENV DEBIAN_FRONTEND="noninteractive" \
    PATH="${PATH}:/opt/mastodon/bin"

# Ignoring these here since we don't want to pin any versions and the Debian image removes apt-get content after use
# hadolint ignore=DL3008,DL3009
RUN apt-get update && \
    echo "Etc/UTC" > /etc/localtime && \
    groupadd -g "${GID}" mastodon && \
    useradd -l -u "$UID" -g "${GID}" -m -d /opt/mastodon mastodon && \
    apt-get -y --no-install-recommends install \
        ca-certificates \
        curl \
        ffmpeg \
        file \
        imagemagick \
        libicu72 \
        libidn12 \
        libjemalloc2 \
        libpq5 \
        libreadline8 \
        libssl3 \
        libvips42 \
        libyaml-0-2 \
        patchelf \
        procps \
        tini \
        tzdata && \
    patchelf --add-needed libjemalloc.so.2 /usr/local/bin/ruby && \
    apt-get -y purge patchelf && \
    ln -s /opt/mastodon /mastodon && \
    corepack enable && \
    echo "label ::1/128 0" > /etc/gai.conf

# Note: no, cleaning here since Debian does this automatically
# See the file /etc/apt/apt.conf.d/docker-clean within the Docker image's filesystem

COPY --chown=mastodon:mastodon . /opt/mastodon
COPY --chown=mastodon:mastodon --from=build /opt/mastodon /opt/mastodon

ENV RAILS_ENV="production" \
    NODE_ENV="production" \
    RAILS_SERVE_STATIC_FILES="true" \
    BIND="0.0.0.0" \
    MASTODON_VERSION_PRERELEASE="${MASTODON_VERSION_PRERELEASE}" \
    MASTODON_VERSION_METADATA="${MASTODON_VERSION_METADATA}"

# Set the run user
USER mastodon
WORKDIR /opt/mastodon

RUN \
# Use Ruby on Rails to create Mastodon assets
  ACTIVE_RECORD_ENCRYPTION_DETERMINISTIC_KEY=precompile_placeholder \
  ACTIVE_RECORD_ENCRYPTION_KEY_DERIVATION_SALT=precompile_placeholder \
  ACTIVE_RECORD_ENCRYPTION_PRIMARY_KEY=precompile_placeholder \
  OTP_SECRET=precompile_placeholder \
  SECRET_KEY_BASE=precompile_placeholder \
  bundle exec rails assets:precompile; \
# Cleanup temporary files
  rm -fr /opt/mastodon/tmp; \
  rm -fr /opt/mastodon/.cache; \
  rm -fr /opt/mastodon/node_modules/.cache; \
  rm -fr /opt/mastodon/vendor/bundle/ruby/*/cache;

# Set the work dir and the container entry point
ENTRYPOINT ["/usr/bin/tini", "--"]
EXPOSE 3000 4000
