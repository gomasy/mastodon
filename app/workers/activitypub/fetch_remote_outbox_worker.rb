# frozen_string_literal: true

class ActivityPub::FetchRemoteOutboxWorker
  include Sidekiq::Worker
  include ExponentialBackoff

  sidekiq_options queue: 'pull', retry: 3

  def perform(account_id)
    @account = Account.find_by(id: account_id)
    return true if @account.nil?

    ActivityPub::FetchRemoteOutboxService.new.call(@account)
  end
end
