
    const alert = createAlert(
      message ?? "Emergency Alert",
      location ?? null
    );

    return NextResponse.json({ 
      success: true, 
      alert 
    });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create alert' 
    }, { status: 500 });
  }
}
