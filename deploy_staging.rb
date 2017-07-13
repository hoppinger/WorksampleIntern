require 'rubygems'
require 'bundler/setup'
# Bundler.require(:default)

require 'sshkit'
require 'sshkit/dsl'
include SSHKit::DSL

require 'yaml'
require 'securerandom'
require 'pry'

SSHKit.config.output_verbosity = Logger::DEBUG

project_path = '~'
project_name = 'undefined'

git_url = 'undefined'

expose_to_port = 'undefined'

cluster_nodes = [
  # 'ikamiut.greenland.hoppinger.com',
  'rodebay.greenland.hoppinger.com'
]

num_deploys_to_keep = 5

on cluster_nodes, in: :parallel, wait: 5 do |host|
  within "#{project_path}/#{project_name}" do
    with rails_env: :staging do
      execute :rm, '-rf repo'
      execute :git, "clone #{git_url} repo"

      within 'repo' do
        image_tag = Time.now.to_i

        execute :docker, "build --force-rm -f Dockerfile.staging -t #{project_name}:#{image_tag} ."
        images = (capture :docker, "images -a --format=\"{{.ID}}:{{.Repository}}:{{.Tag}}\"").split("\n")
                 .map{|image| image.split(":")}
                 .select{|(id,name,tag)| name == project_name}

        images.each do |id, name, tag|
          p "Stopping #{[id, name, tag]}"

          begin
            execute :docker, "rm $(docker stop $(docker ps -a -q --filter ancestor=#{name}:#{tag} --format=\"{{.ID}}\"))"

            p "Stopped #{[id, name, tag]}"
          rescue
            p "Cannot stop #{[id, name, tag]} as it is not running"
          end
        end

        images = images.select{ |id, name, tag| tag.to_i.to_s == tag }
                 .map { |id, name, tag| [id, name, tag.to_i] }
                 .sort_by { |id, name, tag| tag }
                 .reverse

        all_images_but_newest = images.drop num_deploys_to_keep
        all_images_but_newest.each do |id, name, tag|
          execute :docker, "rmi #{name}:#{tag}"
        end

        execute :docker, "run --restart=always -d -p 0.0.0.0:#{expose_to_port}:5000 -t #{project_name}:#{image_tag}"
      end
    end
  end
end
