# Generated by Django 3.1.7 on 2021-10-29 07:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('radius', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='lead',
            old_name='zone',
            new_name='area',
        ),
    ]
