FROM nginx:1.25-alpine

# Remove the default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Create the custom nginx configuration during the build
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]