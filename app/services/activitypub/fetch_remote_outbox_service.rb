# frozen_string_literal: true

class ActivityPub::FetchRemoteOutboxService < BaseService
  include JsonLdHelper

  def call(account, **options)
    return if account.outbox_url.blank? || account.suspended? || account.local?

    @account = account
    @options = options
    @json    = fetch_resource(@account.outbox_url, true, local_follower)

    return unless supported_context?(@json)

    process_items(collection_items(@json))
  end

  private

  def collection_items(collection)
    collection = fetch_collection(collection['first']) if collection['first'].present?
    return unless collection.is_a?(Hash)

    case collection['type']
    when 'OrderedCollection', 'OrderedCollectionPage'
      collection['orderedItems']
    end
  end

  def fetch_collection(collection_or_uri)
    return collection_or_uri if collection_or_uri.is_a?(Hash)
    return if non_matching_uri_hosts?(@account.uri, collection_or_uri)

    fetch_resource_without_id_validation(collection_or_uri, local_follower, true)
  end

  def process_items(items)
    items.reverse_each.filter_map { |item| process_item(item) }
  end

  def process_item(item)
    case item['type']
    when 'Create'
    when 'Announce'
    else return
    end

    uri = value_or_id(item)
    return if ActivityPub::TagManager.instance.local_uri?(uri) || non_matching_uri_hosts?(@account.uri, uri)

    activity = ActivityPub::Activity.factory(item, @account, **@options)
    activity&.perform
  end

  def local_follower
    return @local_follower if defined?(@local_follower)

    @local_follower = @account.followers.local.without_suspended.first
  end
end
