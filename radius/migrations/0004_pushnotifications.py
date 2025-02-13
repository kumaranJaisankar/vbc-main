# Generated by Django 3.1.7 on 2024-06-18 07:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('radius', '0003_lead_onboarded_on'),
    ]

    operations = [
        migrations.CreateModel(
            name='PushNotifications',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('body', models.TextField()),
                ('image', models.TextField(blank=True, null=True)),
                ('topic', models.CharField(max_length=255)),
                ('user', models.IntegerField(max_length=255)),
                ('sent_date', models.DateTimeField()),
                ('isSent', models.BooleanField(default=False)),
                ('created_by', models.IntegerField()),
                ('updated_by', models.IntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted', models.CharField(choices=[('0', 'False'), ('1', 'True'), ('2', 'Restricted')], default='0', max_length=1)),
                ('deleted_by', models.IntegerField(blank=True, null=True)),
                ('deleted_at', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'ordering': ['-id'],
            },
        ),
    ]
