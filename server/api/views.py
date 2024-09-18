import boto3
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

s3_client = boto3.client('s3',
                          aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                              region_name=settings.AWS_S3_REGION_NAME)

@csrf_exempt
def upload_video(request):
    if request.method == 'POST':
        video_file = request.FILES['video']
        file_name = f"student_videos/{video_file.name}"

        # Save file to AWS S3
        s3_client.upload_fileobj(
            video_file,
            settings.AWS_STORAGE_BUCKET_NAME,
            file_name,
            ExtraArgs={"ContentType": video_file.content_type}
        )
        
        video_url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{file_name}"
        return JsonResponse({'message': 'Video uploaded successfully', 'video_url': video_url})
